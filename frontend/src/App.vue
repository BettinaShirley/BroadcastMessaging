ap<script setup>
import { ref } from 'vue';
import Starfield from './components/Starfield.vue';

const files = ref([]);
const uploadStatus = ref('');

const handleFileUpload = (event) => {
  const selectedFiles = Array.from(event.target.files);

  if (selectedFiles.length !== 3) {
    alert("You must upload exactly 3 images.");
    files.value = [];
    uploadStatus.value = '';
    return;
  }

  files.value = selectedFiles;
  uploadStatus.value = `Selected 3 files`;
};

const startUpload = async () => {
  if (files.value.length !== 3) {
    alert("Please select exactly 3 files before sending broadcast.");
    return;
  }

  const formData = new FormData();
  files.value.forEach((file) => {
    formData.append('files', file);
  });

  uploadStatus.value = 'Uploading files...';

  try {
    const response = await fetch('http://localhost:3001/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      uploadStatus.value = 'Files uploaded successfully! Starting WhatsApp broadcast...';
      
      const whatsappResponse = await fetch('http://localhost:3001/api/send-broadcast', {
        method: 'POST',
      });

      if (whatsappResponse.ok) {
        uploadStatus.value = 'WhatsApp broadcast started successfully!';
      } else {
        uploadStatus.value = 'Error starting WhatsApp broadcast';
      }
      
      files.value = [];
    } else {
      uploadStatus.value = 'Error uploading files';
      console.error('Error uploading files');
    }
  } catch (error) {
    uploadStatus.value = 'Failed to connect to server';
    console.error('Network error:', error);
  }
};
</script>

<template>
  <Starfield />
  <div class="container">
    <h1>WhatsApp Broadcast Messenger</h1>
    <div class="upload-section">
      <h2>Upload 3 Images</h2>
      <input type="file" multiple accept="image/*" @change="handleFileUpload" />
      <p class="status">{{ uploadStatus }}</p>
      <button @click="startUpload" :disabled="files.length !== 3">Send Broadcast</button>
    </div>
    <div class="file-list" v-if="files.length > 0">
      <h3>Selected Files:</h3>
      <ul>
        <li v-for="(file, index) in files" :key="index">{{ file.name }}</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 600px;
  padding: 20px;
  font-family: Arial, sans-serif;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
}

.upload-section {
  margin-bottom: 20px;
  padding: 20px;
  border: 2px dashed rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.05);
}

.status {
  color: rgba(255, 255, 255, 0.8);
  font-style: italic;
  margin: 10px 0;
}

button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.file-list {
  background-color: rgba(255, 255, 255, 0.05);
  padding: 15px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.file-list h3 {
  margin-top: 0;
  color: white;
}

.file-list ul {
  list-style-type: none;
  padding: 0;
}

.file-list li {
  padding: 5px 0;
  border-bottom: 1px solid #eee;
}
</style>
