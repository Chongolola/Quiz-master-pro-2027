import { get, set, del, keys } from 'idb-keyval';

export const storageService = {
  /**
   * Saves a file (Blob) to IndexedDB
   */
  async saveFile(id: string, blob: Blob): Promise<void> {
    await set(`pdf_file_${id}`, blob);
    // Also save metadata to keep track of downloaded IDs easily
    const downloadedIds = await this.getDownloadedIds();
    if (!downloadedIds.includes(id)) {
      await set('downloaded_pdf_ids', [...downloadedIds, id]);
    }
  },

  /**
   * Retrieves a file from IndexedDB
   */
  async getFile(id: string): Promise<Blob | undefined> {
    return await get(`pdf_file_${id}`);
  },

  /**
   * Removes a file from IndexedDB
   */
  async removeFile(id: string): Promise<void> {
    await del(`pdf_file_${id}`);
    const downloadedIds = await this.getDownloadedIds();
    await set('downloaded_pdf_ids', downloadedIds.filter(i => i !== id));
  },

  /**
   * Gets list of all downloaded file IDs
   */
  async getDownloadedIds(): Promise<string[]> {
    return (await get<string[]>('downloaded_pdf_ids')) || [];
  },

  /**
   * Downloads a file from URL and saves it
   */
  async downloadAndSave(id: string, url: string): Promise<void> {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Falha no download');
      const blob = await response.blob();
      await this.saveFile(id, blob);
    } catch (error) {
      console.error('Error downloading file:', error);
      throw error;
    }
  }
};
