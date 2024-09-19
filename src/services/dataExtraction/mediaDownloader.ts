import axios from 'axios';
import { promises as fs } from 'fs';
import path from 'path';
import { config } from '../config/apiConfig';
import { logger } from '../utils/logger';
import { MediaData } from '../types';

class MediaDownloader {
  private downloadPath: string;

  constructor(downloadPath: string) {
    // Set the downloadPath property to the provided path or default from config
    this.downloadPath = downloadPath || config.defaultMediaDownloadPath;

    // Ensure the download directory exists, create it if it doesn't
    fs.mkdir(this.downloadPath, { recursive: true });
  }

  async downloadMedia(mediaUrls: string[], tweetId: string): Promise<MediaData[]> {
    const tweetDir = path.join(this.downloadPath, tweetId);
    await fs.mkdir(tweetDir, { recursive: true });

    const mediaDataArray: MediaData[] = [];

    for (const url of mediaUrls) {
      try {
        // Generate a unique filename
        const filename = this.getUniqueFilename(url);
        const filePath = path.join(tweetDir, filename);

        // Download the file using axios
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        
        // Save the file to the tweet's subdirectory
        await fs.writeFile(filePath, response.data);

        // Create a MediaData object with file information
        const mediaData: MediaData = {
          url,
          filename,
          path: filePath,
          size: response.data.length,
          type: response.headers['content-type'],
        };

        mediaDataArray.push(mediaData);
      } catch (error) {
        logger.error(`Failed to download media from ${url}: ${error.message}`);
      }
    }

    // Log the successful download of media files
    logger.info(`Successfully downloaded ${mediaDataArray.length} media files for tweet ${tweetId}`);

    return mediaDataArray;
  }

  private getUniqueFilename(url: string): string {
    // Extract the file extension from the URL
    const extension = path.extname(url);

    // Generate a unique identifier (e.g., using a timestamp and random string)
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;

    // Combine the unique identifier with the file extension
    return `${uniqueId}${extension}`;
  }

  async cleanupOldMedia(thresholdDays: number): Promise<void> {
    // Calculate the threshold date
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - thresholdDays);

    let deletedCount = 0;
    let freedSpace = 0;

    const traverseDirectory = async (directory: string) => {
      const entries = await fs.readdir(directory, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(directory, entry.name);

        if (entry.isDirectory()) {
          await traverseDirectory(fullPath);
        } else {
          const stats = await fs.stat(fullPath);
          if (stats.ctime < thresholdDate) {
            await fs.unlink(fullPath);
            deletedCount++;
            freedSpace += stats.size;
          }
        }
      }
    };

    await traverseDirectory(this.downloadPath);

    // Log the number of files deleted and total space freed
    logger.info(`Cleaned up ${deletedCount} old media files, freeing up ${freedSpace} bytes of space`);
  }
}

export function createMediaDownloader(): MediaDownloader {
  // Retrieve the default download path from apiConfig
  const defaultPath = config.defaultMediaDownloadPath;

  // Create a new MediaDownloader instance with the default path
  return new MediaDownloader(defaultPath);
}

// Human tasks:
// TODO: Implement a retry mechanism for failed downloads
// TODO: Consider adding support for different types of media (images, videos, GIFs)
// TODO: Implement a cleanup mechanism to remove old media files and free up storage
// TODO: Determine an appropriate threshold for media file retention
// TODO: Schedule regular execution of this cleanup function
// TODO: Implement a mechanism to handle rate limiting when downloading media from Twitter
// TODO: Consider implementing parallel downloads to improve performance for tweets with multiple media files
// TODO: Develop a strategy for handling duplicate media files across different tweets
// TODO: Implement error handling for cases where media downloads fail or files are corrupted