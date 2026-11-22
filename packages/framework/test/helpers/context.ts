let uploadDir = "";

export const currentUploadDir = (): string => uploadDir;

export const setCurrentUploadDir = (directory: string): void => {
  uploadDir = directory;
};
