import { api } from '@/api/api';
import { uploadFileToCloudinary } from '@/api/cloudinary.service';
import type { FileType, ProjectFile } from '@/types';

export interface UploadFilePayload {
  projectId: string;
  file: File;
  type?: FileType;
}

interface RegisterCloudinaryFilePayload {
  projectId: string;
  type?: FileType;
  url: string;
  filename: string;
  size?: number;
  cloudinaryPublicId: string;
  cloudinaryResourceType?: string;
  cloudinaryFormat?: string;
}

function getCloudinaryProjectFolder(projectId: string) {
  const baseFolder = import.meta.env.VITE_CLOUDINARY_FOLDER?.trim();
  const projectFolder = `projects/${projectId}`;

  return baseFolder ? `${baseFolder}/${projectFolder}` : projectFolder;
}

async function registerCloudinaryFile({
  projectId,
  ...payload
}: RegisterCloudinaryFilePayload) {
  const response = await api.post<ProjectFile>(
    `/files/upload/${projectId}`,
    {
      ...payload,
      provider: 'cloudinary',
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  return response.data;
}

export const filesService = {
  async uploadSingle({ projectId, file, type }: UploadFilePayload) {
    const uploadedFile = await uploadFileToCloudinary(file, {
      folder: getCloudinaryProjectFolder(projectId),
      tags: ['graduation-project', projectId],
    });

    return registerCloudinaryFile({
      projectId,
      type,
      url: uploadedFile.secure_url,
      filename: file.name,
      size: uploadedFile.bytes ?? file.size,
      cloudinaryPublicId: uploadedFile.public_id,
      cloudinaryResourceType: uploadedFile.resource_type,
      cloudinaryFormat: uploadedFile.format,
    });
  },

  async getByProject(projectId: string) {
    const response = await api.get<ProjectFile[]>(`/files/${projectId}`);
    return response.data;
  },

  async delete(fileId: string) {
    await api.delete(`/files/${fileId}`);
  },
};
