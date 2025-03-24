import axios from "axios";

// Fetching all the notes from the folder ID
export const fetchAllNotes = async (folderId: string | undefined, page = 1, limit = 10) => {
  try {
    const response = await axios.get(
      `https://nowted-server.remotestate.com/notes?archived=false&deleted=false&folderId=${folderId}&page=${page}&limit=${limit}`
    );
    return response.data.notes;
  } catch (error) {
    console.error("Error fetching notes:", error);
    return [];
  }
};

// Fetching the favorite notes
export const fetchAllFavorites = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(
      `https://nowted-server.remotestate.com/notes?archived=false&favorite=true&deleted=false&page=${page}&limit=${limit}`
    );
    return response.data.notes || [];
  } catch (error) {
    console.log("Error fetching favorite notes:", error);
    return [];
  }
};

// Fetching the archived notes
export const fetchAllArchivedNotes = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(
      `https://nowted-server.remotestate.com/notes?archived=true&deleted=false&page=${page}&limit=${limit}`
    );
    return response.data.notes || [];
  } catch (error) {
    console.error("Error fetching archived notes:", error);
    return [];
  }
};

// Fetching the trash notes
export const fetchAllTrashNotes = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(
      `https://nowted-server.remotestate.com/notes?deleted=true&archive=false&page=${page}&limit=${limit}`
    );
    return response.data.notes || [];
  } catch (error) {
    console.error("Error fetching trash notes:", error);
    return [];
  }
};

// Create note API
export const createNote = async (folderId: string) => {
  try {
    if (!folderId) {
      alert("Select a folder first"); // Display alert when folderId is missing
      return false;
    }
    await axios.post(`https://nowted-server.remotestate.com/notes`, {
      folderId,
      title: "New Note 1",
      content: "This is a new note.",
      isFavorite: false,
      isArchived: false,
    });
    return true;
  } catch (error) {
    console.error("Error creating note:", error);
    alert("Failed to create note. Please try again."); // Display alert on error
    return false;
  }
};

// Folder interface
export interface Folder {
  id: string;
  name: string;
}

// Fetch folders
export const fetchFolders = async (): Promise<Folder[]> => {
  const response = await axios.get("https://nowted-server.remotestate.com/folders");
  return response.data.folders;
};

// Add folder API
export const addFolder = async (): Promise<Folder> => {
  const response = await axios.post("https://nowted-server.remotestate.com/folders", { name: "New Folder" });
  return response.data;
};

// Delete folder API
export const deleteFolder = async (folderId: string): Promise<void> => {
  try {
    await axios.delete(`https://nowted-server.remotestate.com/folders/${folderId}`);
    console.log(`Folder with ID ${folderId} deleted successfully.`);
  } catch (error) {
    console.error(`Error deleting folder with ID ${folderId}:`, error);
    throw new Error("Failed to delete folder.");
  }
};

// Update folder name API
export const updateFolderName = async (folderId: string, newName: string): Promise<void> => {
  try {
    await axios.patch(`https://nowted-server.remotestate.com/folders/${folderId}`, { name: newName });
    console.log(`Folder with ID ${folderId} updated successfully to "${newName}".`);
  } catch (error) {
    console.error(`Error updating folder with ID ${folderId}:`, error);
    throw new Error("Failed to update folder name.");
  }
};
export const fetchFolderById = async (folderId: string) => {
  const response = await axios.get("https://nowted-server.remotestate.com/folders");
  const matchedFolder = response.data.folders.find((folder: { id: string }) => folder.id === folderId);
  if (matchedFolder) {
    return matchedFolder.name;
  }
  throw new Error("Folder not found");
};