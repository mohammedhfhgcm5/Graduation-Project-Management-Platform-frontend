interface CloudinaryUploadOptions {
  folder?: string;
  tags?: string[];
}

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  original_filename?: string;
  bytes?: number;
  format?: string;
  resource_type?: string;
}

function getCloudinaryConfig() {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME?.trim();
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET?.trim();
  const folder = import.meta.env.VITE_CLOUDINARY_FOLDER?.trim();

  if (!cloudName || !uploadPreset) {
    throw new Error(
      'Cloudinary is not configured. Add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET to .env.',
    );
  }

  return {
    cloudName,
    uploadPreset,
    folder,
  };
}

async function getCloudinaryError(response: Response) {
  try {
    const body = (await response.json()) as {
      error?: {
        message?: string;
      };
    };

    if (body.error?.message) {
      return body.error.message;
    }
  } catch {
    // Cloudinary usually returns JSON errors, but keep a safe fallback.
  }

  return 'Cloudinary upload failed. Please check your cloud name and upload preset.';
}

export async function uploadFileToCloudinary(
  file: File,
  options: CloudinaryUploadOptions = {},
) {
  const config = getCloudinaryConfig();
  const formData = new FormData();
  const folder = options.folder ?? config.folder;

  formData.append('file', file);
  formData.append('upload_preset', config.uploadPreset);
  // formData.append('use_filename', 'true');
  // formData.append('unique_filename', 'true');

  if (folder) {
    formData.append('folder', folder);
  }

  if (options.tags?.length) {
    formData.append('tags', options.tags.join(','));
  }

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${config.cloudName}/auto/upload`,
    {
      method: 'POST',
      body: formData,
    },
  );

  if (!response.ok) {
    throw new Error(await getCloudinaryError(response));
  }

  return (await response.json()) as CloudinaryUploadResult;
}
