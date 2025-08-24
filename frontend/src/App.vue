<script setup>
import { ref } from 'vue';

const files = ref([]);

const handleFileUpload = (event) => {
  const selectedFiles = Array.from(event.target.files);
  if (selectedFiles.length > 3) {
    alert("Please upload a maximum of 3 files.");
    return;
  }
  files.value = selectedFiles;
};

const startUpload = async () => {
  if (files.value.length === 0) {
    alert("Please select files to upload.");
    return;
  }

  const formData = new FormData();
  files.value.forEach((file) => {
    formData.append('files', file);
  });

  const response = await fetch('http://localhost:3001/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (response.ok) {
    console.log('Files uploaded successfully');
  } else {
    console.error('Error uploading files');
  }
};
</script>

<template>
  <h1>You did it!</h1>
  <input type="file" multiple accept="image/*" @change="handleFileUpload" />
  <input type="file" multiple accept="image/*" @change="handleFileUpload" />
  <input type="file" multiple accept="image/*" @change="handleFileUpload" />
  <button @click="startUpload">Start</button>
</template>

<style scoped></style>
