// Test script to verify Firebase Storage configuration
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCkMsGN5PpQJoQggah7LKiwhy3dRebS2tI",
  authDomain: "porfolio-95ac1.firebaseapp.com",
  projectId: "porfolio-95ac1",
  storageBucket: "porfolio-95ac1.appspot.com",
  messagingSenderId: "570537351127",
  appId: "1:570537351127:web:f03018aeb50d09af361d92",
  measurementId: "G-M5G9MJTX6V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Storage
const storage = getStorage(app);

console.log('Firebase initialized with storage bucket:', firebaseConfig.storageBucket);

// Test function to upload a file
async function testUpload() {
  try {
    // Create a test file (a simple text blob)
    const testBlob = new Blob(['Test file content'], { type: 'text/plain' });
    
    // Create a reference to the storage location
    const storageRef = ref(storage, 'test/test-file.txt');
    
    // Upload the file
    console.log('Uploading test file...');
    const snapshot = await uploadBytes(storageRef, testBlob);
    console.log('Upload successful:', snapshot);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);
    console.log('Download URL:', downloadURL);
    
    return 'Test completed successfully';
  } catch (error) {
    console.error('Error during test:', error);
    return `Test failed: ${error.message}`;
  }
}

// Run the test
testUpload().then(result => {
  console.log(result);
});