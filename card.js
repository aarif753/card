// Configuration
const CLOUDINARY_CONFIG = {
  cloudName: "dtjpgolj6",
  uploadPreset: "upload",
  apiKey: "941795357375981",
  apiUrl: "https://api.cloudinary.com/v1_1/dtjpgolj6/image/upload"
};

// State variables
let selectedEmojis = ['🎉', '🎂', '🎈', '🎁', '✨'];
let isFlipping = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

function initializeApp() {
  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', function() {
      navLinks.classList.toggle('active');
    });
  }

  // Initialize emoji selection
  initializeEmojiSelection();
  
  // Load saved data
  loadFromLocalStorage();
  
  // Load from URL parameters if present
  loadCardFromURL();
  
  // Initialize card
  updateCard();
  
  // Set up auto-save
  setupAutoSave();
  
  // Set up card click handler
  setupCardInteraction();
}

// Initialize emoji selection
function initializeEmojiSelection() {
  const emojiOptions = document.querySelectorAll('.emoji-option');
  
  emojiOptions.forEach(option => {
    const emoji = option.dataset.emoji;
    
    // Set initial selection state
    if (selectedEmojis.includes(emoji)) {
      option.classList.add('selected');
    }
    
    // Add click handler
    option.addEventListener('click', function() {
      toggleEmoji(emoji, this);
    });
  });
  
  updateSelectedEmojisDisplay();
}

// Toggle emoji selection
function toggleEmoji(emoji, element) {
  const index = selectedEmojis.indexOf(emoji);
  
  if (index === -1) {
    selectedEmojis.push(emoji);
    element.classList.add('selected');
  } else {
    selectedEmojis.splice(index, 1);
    element.classList.remove('selected');
  }
  
  updateSelectedEmojisDisplay();
  saveToLocalStorage();
}

// Update selected emojis display
function updateSelectedEmojisDisplay() {
  const container = document.getElementById('selectedEmojis');
  if (container) {
    if (selectedEmojis.length > 0) {
      container.innerHTML = `<p>Selected emojis: ${selectedEmojis.join(' ')}</p>`;
    } else {
      container.innerHTML = '<p>No emojis selected. Click emojis above to select.</p>';
    }
  }
}

// Set up card interaction
function setupCardInteraction() {
  const flipCard = document.getElementById('flipCard');
  if (flipCard) {
    flipCard.addEventListener('click', function() {
      this.classList.toggle('flipped');
      
      // Only show random emojis when flipping to back
      if (this.classList.contains('flipped')) {
        showRandomEmojis();
      }
    });
  }
}

// Show random emojis
function showRandomEmojis() {
  if (selectedEmojis.length === 0 || isFlipping) return;
  
  isFlipping = true;
  
  // Create 3-5 random emojis
  const emojiCount = Math.floor(Math.random() * 3) + 3;
  
  for (let i = 0; i < emojiCount; i++) {
    setTimeout(() => {
      const emoji = selectedEmojis[Math.floor(Math.random() * selectedEmojis.length)];
      createFloatingEmoji(emoji);
    }, i * 200);
  }
  
  setTimeout(() => {
    isFlipping = false;
  }, 1000);
}

// Create floating emoji element
function createFloatingEmoji(emoji) {
  const emojiElement = document.createElement('div');
  emojiElement.className = 'random-emoji';
  emojiElement.textContent = emoji;
  emojiElement.style.left = Math.random() * 80 + 10 + '%';
  emojiElement.style.top = Math.random() * 80 + 10 + '%';
  emojiElement.style.color = getRandomColor();
  emojiElement.style.fontSize = Math.random() * 20 + 40 + 'px';
  
  document.body.appendChild(emojiElement);
  
  // Remove after animation
  setTimeout(() => {
    emojiElement.remove();
  }, 2000);
}

// Get random color
function getRandomColor() {
  const colors = ['#FF5252', '#FF4081', '#E040FB', '#7C4DFF', '#536DFE', 
                  '#448AFF', '#40C4FF', '#18FFFF', '#64FFDA', '#69F0AE',
                  '#B2FF59', '#EEFF41', '#FFFF00', '#FFD740', '#FFAB40'];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Validate URL format
function isValidUrl(url) {
  if (!url || url.trim() === '') return true; // Empty is valid (optional)
  
  try {
    // Try to create a URL object
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

// Show error message
function showError(elementId, message) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = message;
    element.style.display = 'block';
    return false;
  }
  return true;
}

// Hide error message
function hideError(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.style.display = 'none';
  }
  return true;
}

// Validate all inputs
function validateInputs() {
  let isValid = true;
  
  // Front message validation
  const frontInput = document.getElementById('frontInput');
  if (!frontInput.value.trim()) {
    isValid = showError('frontError', 'Front message is required') && isValid;
    frontInput.classList.add('has-error');
  } else {
    hideError('frontError');
    frontInput.classList.remove('has-error');
  }
  
  // Image URL validation
  const imageUrl = document.getElementById('imageUrl').value.trim();
  if (imageUrl && !isValidUrl(imageUrl)) {
    isValid = showError('imageError', 'Please enter a valid URL') && isValid;
    document.getElementById('imageUrl').classList.add('has-error');
  } else {
    hideError('imageError');
    document.getElementById('imageUrl').classList.remove('has-error');
  }
  
  // Back title validation
  const backTitle = document.getElementById('backTitle');
  if (!backTitle.value.trim()) {
    isValid = showError('titleError', 'Back title is required') && isValid;
    backTitle.classList.add('has-error');
  } else {
    hideError('titleError');
    backTitle.classList.remove('has-error');
  }
  
  // Back message validation
  const backInput = document.getElementById('backInput');
  if (!backInput.value.trim()) {
    isValid = showError('messageError', 'Back message is required') && isValid;
    backInput.classList.add('has-error');
  } else {
    hideError('messageError');
    backInput.classList.remove('has-error');
  }
  
  // Social media links validation
  const socialInputs = ['instagram', 'facebook', 'twitter', 'youtube'];
  let socialError = false;
  
  for (const inputId of socialInputs) {
    const input = document.getElementById(inputId);
    const url = input.value.trim();
    if (url && !isValidUrl(url)) {
      socialError = true;
      input.classList.add('has-error');
    } else {
      input.classList.remove('has-error');
    }
  }
  
  if (socialError) {
    isValid = showError('socialError', 'Please enter valid URLs for social media') && isValid;
  } else {
    hideError('socialError');
  }
  
  return isValid;
}

// Update card with new content
function updateCard() {
  if (!validateInputs()) {
    showTemporaryMessage('Please fix errors before updating', 'error');
    return;
  }
  
  try {
    // Update front message
    const frontMessage = document.getElementById('frontInput').value;
    document.getElementById('frontMessage').innerText = frontMessage;
    
    // Update profile image
    const imageUrl = document.getElementById('imageUrl').value.trim() || 'https://i.imgur.com/JqYeYn7.jpg';
    const profileImage = document.getElementById('profileImage');
    
    // Add loading state
    profileImage.classList.add('loading');
    
    // Preload image
    const img = new Image();
    img.onload = function() {
      profileImage.src = imageUrl;
      profileImage.classList.remove('loading');
    };
    
    img.onerror = function() {
      profileImage.src = 'https://i.imgur.com/JqYeYn7.jpg';
      profileImage.classList.remove('loading');
      showTemporaryMessage('Could not load image. Using default.', 'error');
    };
    
    img.src = imageUrl;
    
    // Update back title
    const backTitle = document.getElementById('backTitle').value;
    document.getElementById('birthdayText').innerText = backTitle;
    
    // Update back message
    const backMessage = document.getElementById('backInput').value;
    document.getElementById('backText').innerHTML = backMessage.replace(/\n/g, '<br>');
    
    // Update social media links
    updateSocialLinks();
    
    // Save to local storage
    saveToLocalStorage();
    
    // Show success message
    showTemporaryMessage('Card updated successfully!', 'success');
  } catch (error) {
    console.error('Error updating card:', error);
    showTemporaryMessage('Error updating card', 'error');
  }
}

// Update social links
function updateSocialLinks() {
  const instagram = document.getElementById('instagram').value.trim();
  const facebook = document.getElementById('facebook').value.trim();
  const twitter = document.getElementById('twitter').value.trim();
  const youtube = document.getElementById('youtube').value.trim();
  
  const socialIcons = document.getElementById('socialIcons');
  socialIcons.innerHTML = '';
  
  const socialLinks = [
    { url: instagram, icon: 'fab fa-instagram', label: 'Instagram' },
    { url: facebook, icon: 'fab fa-facebook', label: 'Facebook' },
    { url: twitter, icon: 'fab fa-twitter', label: 'Twitter' },
    { url: youtube, icon: 'fab fa-youtube', label: 'YouTube' }
  ];
  
  socialLinks.forEach(link => {
    if (link.url) {
      const a = document.createElement('a');
      a.href = link.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.setAttribute('aria-label', link.label);
      
      const i = document.createElement('i');
      i.className = link.icon;
      
      a.appendChild(i);
      socialIcons.appendChild(a);
    }
  });
  
  // If no social links, show message
  if (socialIcons.children.length === 0) {
    socialIcons.innerHTML = '<p style="color:#666; font-style:italic;">No social links added</p>';
  }
}

// Download card as HTML file
function downloadCard() {
  if (!validateInputs()) {
    showTemporaryMessage('Please fix errors before downloading', 'error');
    return;
  }
  
  try {
    const frontMessage = document.getElementById('frontInput').value;
    const imageUrl = document.getElementById('imageUrl').value.trim() || 'https://i.imgur.com/JqYeYn7.jpg';
    const backTitle = document.getElementById('backTitle').value;
    const backMessage = document.getElementById('backInput').value.replace(/\n/g, '<br>');
    
    const instagram = document.getElementById('instagram').value.trim();
    const facebook = document.getElementById('facebook').value.trim();
    const twitter = document.getElementById('twitter').value.trim();
    const youtube = document.getElementById('youtube').value.trim();
    
    // Generate social icons HTML
    let socialIconsHTML = '';
    if (instagram) socialIconsHTML += `<a href="${escapeHtml(instagram)}" target="_blank" aria-label="Instagram"><i class="fab fa-instagram"></i></a>`;
    if (facebook) socialIconsHTML += `<a href="${escapeHtml(facebook)}" target="_blank" aria-label="Facebook"><i class="fab fa-facebook"></i></a>`;
    if (twitter) socialIconsHTML += `<a href="${escapeHtml(twitter)}" target="_blank" aria-label="Twitter"><i class="fab fa-twitter"></i></a>`;
    if (youtube) socialIconsHTML += `<a href="${escapeHtml(youtube)}" target="_blank" aria-label="YouTube"><i class="fab fa-youtube"></i></a>`;
    
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Birthday Card</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Poppins', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 20px;
        }
        
        .card-container {
            width: 100%;
            max-width: 500px;
        }
        
        .flip-card {
            background-color: transparent;
            width: 100%;
            height: 600px;
            perspective: 1000px;
        }
        
        .flip-card-inner {
            position: relative;
            width: 100%;
            height: 100%;
            text-align: center;
            transition: transform 0.8s;
            transform-style: preserve-3d;
            box-shadow: 0 15px 35px rgba(0,0,0,0.3);
            border-radius: 20px;
            cursor: pointer;
        }
        
        .flip-card:hover .flip-card-inner {
            transform: rotateY(180deg);
        }
        
        .flip-card-front, .flip-card-back {
            position: absolute;
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
            border-radius: 20px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 40px;
        }
        
        .flip-card-front {
            background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
            color: #d32f2f;
            font-size: 2.5rem;
            font-weight: bold;
            text-shadow: 3px 3px 6px rgba(0,0,0,0.2);
            border: 8px solid #FFD700;
        }
        
        .flip-card-back {
            background: linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%);
            color: #333;
            font-size: 1.2rem;
            line-height: 1.8;
            transform: rotateY(180deg);
            border: 8px solid #4CAF50;
            overflow-y: auto;
        }
        
        .profile-image {
            width: 180px;
            height: 180px;
            border-radius: 50%;
            object-fit: cover;
            border: 6px solid white;
            box-shadow: 0 8px 25px rgba(0,0,0,0.3);
            margin-bottom: 25px;
        }
        
        .birthday-text {
            font-size: 2rem;
            font-weight: bold;
            color: #E91E63;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
            margin: 20px 0;
        }
        
        .social-icons {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-top: 30px;
            flex-wrap: wrap;
        }
        
        .social-icons a {
            color: #333;
            font-size: 28px;
            transition: all 0.3s;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: rgba(255,255,255,0.3);
        }
        
        .social-icons a:hover {
            transform: scale(1.2);
            color: #E91E63;
            background: rgba(255,255,255,0.5);
        }
        
        .message {
            margin: 20px 0;
            font-size: 1.1rem;
            line-height: 1.6;
        }
        
        .footer-note {
            margin-top: 30px;
            font-size: 0.9rem;
            color: #666;
            font-style: italic;
        }
        
        @media (max-width: 600px) {
            .flip-card {
                height: 500px;
            }
            
            .flip-card-front {
                font-size: 2rem;
                padding: 20px;
            }
            
            .flip-card-back {
                font-size: 1rem;
                padding: 20px;
            }
            
            .profile-image {
                width: 140px;
                height: 140px;
            }
            
            .birthday-text {
                font-size: 1.5rem;
            }
        }
    </style>
</head>
<body>
    <div class="card-container">
        <div class="flip-card">
            <div class="flip-card-inner">
                <div class="flip-card-front">
                    ${escapeHtml(frontMessage)}
                </div>
                <div class="flip-card-back">
                    <img src="${escapeHtml(imageUrl)}" alt="Birthday Person" class="profile-image" onerror="this.src='https://i.imgur.com/JqYeYn7.jpg'">
                    <div class="birthday-text">${escapeHtml(backTitle)}</div>
                    <div class="message">${backMessage}</div>
                    ${socialIconsHTML ? `<div class="social-icons">${socialIconsHTML}</div>` : ''}
                    <div class="footer-note">Made with ❤️ using GreetingCard Maker</div>
                </div>
            </div>
        </div>
    </div>
    
    <script>
        // Add flip functionality
        document.querySelector('.flip-card').addEventListener('click', function() {
            this.querySelector('.flip-card-inner').style.transform = 
                this.querySelector('.flip-card-inner').style.transform === 'rotateY(180deg)' 
                ? 'rotateY(0deg)' 
                : 'rotateY(180deg)';
        });
    </script>
</body>
</html>`;
    
    const blob = new Blob([htmlContent], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "birthday_card.html";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    
    showTemporaryMessage('Card downloaded successfully!', 'success');
  } catch (error) {
    console.error('Error downloading card:', error);
    showTemporaryMessage('Error downloading card', 'error');
  }
}

// Escape HTML to prevent XSS
function escapeHtml(unsafe) {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Add confetti effect
function addConfetti() {
  const colors = ['#FF5252', '#FF4081', '#E040FB', '#7C4DFF', '#536DFE', 
                  '#448AFF', '#40C4FF', '#18FFFF', '#64FFDA', '#69F0AE'];
  
  // Remove existing confetti
  document.querySelectorAll('.confetti').forEach(el => el.remove());
  
  for (let i = 0; i < 150; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.width = Math.random() * 15 + 5 + 'px';
      confetti.style.height = Math.random() * 15 + 5 + 'px';
      confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
      confetti.style.animationDuration = Math.random() * 3 + 2 + 's';
      confetti.style.animationDelay = Math.random() * 1 + 's';
      
      document.body.appendChild(confetti);
      
      // Remove confetti after animation completes
      setTimeout(() => {
        if (confetti.parentNode) {
          confetti.remove();
        }
      }, 6000);
    }, i * 10);
  }
  
  showTemporaryMessage('Confetti added! 🎉', 'success');
}

// Show temporary message
function showTemporaryMessage(message, type = 'info') {
  // Remove existing messages
  const existingMessages = document.querySelectorAll('.success-message');
  existingMessages.forEach(msg => msg.remove());
  
  const messageElement = document.createElement('div');
  messageElement.className = 'success-message';
  messageElement.style.backgroundColor = type === 'success' ? '#4CAF50' : 
                                        type === 'error' ? '#F44336' : '#2196F3';
  
  const icon = type === 'success' ? 'fas fa-check-circle' :
               type === 'error' ? 'fas fa-exclamation-circle' :
               'fas fa-info-circle';
  
  messageElement.innerHTML = `
    <i class="${icon}"></i>
    <span>${message}</span>
  `;
  
  document.body.appendChild(messageElement);
  
  // Remove message after animation completes
  setTimeout(() => {
    if (messageElement.parentNode) {
      messageElement.remove();
    }
  }, 3000);
}

// Save card data to local storage
function saveToLocalStorage() {
  try {
    const cardData = {
      frontMessage: document.getElementById('frontInput').value,
      imageUrl: document.getElementById('imageUrl').value,
      backTitle: document.getElementById('backTitle').value,
      backMessage: document.getElementById('backInput').value,
      instagram: document.getElementById('instagram').value,
      facebook: document.getElementById('facebook').value,
      twitter: document.getElementById('twitter').value,
      youtube: document.getElementById('youtube').value,
      selectedEmojis: selectedEmojis,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('birthdayCardData', JSON.stringify(cardData));
  } catch (e) {
    console.error('Local storage error:', e);
  }
}

// Load card data from local storage
function loadFromLocalStorage() {
  try {
    const savedData = localStorage.getItem('birthdayCardData');
    if (savedData) {
      const cardData = JSON.parse(savedData);
      
      // Restore form values
      if (cardData.frontMessage) document.getElementById('frontInput').value = cardData.frontMessage;
      if (cardData.imageUrl) document.getElementById('imageUrl').value = cardData.imageUrl;
      if (cardData.backTitle) document.getElementById('backTitle').value = cardData.backTitle;
      if (cardData.backMessage) document.getElementById('backInput').value = cardData.backMessage;
      if (cardData.instagram) document.getElementById('instagram').value = cardData.instagram;
      if (cardData.facebook) document.getElementById('facebook').value = cardData.facebook;
      if (cardData.twitter) document.getElementById('twitter').value = cardData.twitter;
      if (cardData.youtube) document.getElementById('youtube').value = cardData.youtube;
      
      // Restore selected emojis
      if (cardData.selectedEmojis && Array.isArray(cardData.selectedEmojis)) {
        selectedEmojis = cardData.selectedEmojis;
        updateSelectedEmojisDisplay();
        
        // Update emoji options selection state
        document.querySelectorAll('.emoji-option').forEach(option => {
          const emoji = option.dataset.emoji;
          if (selectedEmojis.includes(emoji)) {
            option.classList.add('selected');
          } else {
            option.classList.remove('selected');
          }
        });
      }
    }
  } catch (e) {
    console.error('Error loading saved data:', e);
  }
}

// Set up auto-save
function setupAutoSave() {
  const inputs = [
    'frontInput', 'imageUrl', 'backTitle', 'backInput',
    'instagram', 'facebook', 'twitter', 'youtube'
  ];
  
  inputs.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener('input', () => {
        saveToLocalStorage();
      });
    }
  });
}

// Upload image to Cloudinary
async function uploadImage() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*,.jpg,.jpeg,.png,.gif,.webp';
  
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      showTemporaryMessage('File size must be less than 10MB', 'error');
      return;
    }
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showTemporaryMessage('Please select a valid image file (JPEG, PNG, GIF, WebP)', 'error');
      return;
    }
    
    // Show progress
    const progress = document.getElementById('uploadProgress');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    progress.style.display = 'block';
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
    formData.append('api_key', CLOUDINARY_CONFIG.apiKey);
    
    try {
      showTemporaryMessage('Uploading image...', 'info');
      
      const response = await fetch(CLOUDINARY_CONFIG.apiUrl, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.secure_url) {
        // Update image URL input
        document.getElementById('imageUrl').value = data.secure_url;
        updateCard();
        showTemporaryMessage('Image uploaded successfully!', 'success');
      } else {
        throw new Error('Upload failed: No URL returned');
      }
    } catch (error) {
      console.error('Upload error:', error);
      showTemporaryMessage('Upload failed. Please try again.', 'error');
    } finally {
      setTimeout(() => {
        progress.style.display = 'none';
        progressFill.style.width = '0%';
        progressText.textContent = '0%';
      }, 2000);
    }
  };
  
  input.click();
}

// Generate shareable URL
function generateShareableURL() {
  if (!validateInputs()) {
    showTemporaryMessage('Please fix errors before generating URL', 'error');
    return;
  }
  
  try {
    const cardData = {
      frontMessage: document.getElementById('frontInput').value,
      imageUrl: document.getElementById('imageUrl').value.trim() || 'https://i.imgur.com/JqYeYn7.jpg',
      backTitle: document.getElementById('backTitle').value,
      backMessage: document.getElementById('backInput').value,
      instagram: document.getElementById('instagram').value.trim(),
      facebook: document.getElementById('facebook').value.trim(),
      twitter: document.getElementById('twitter').value.trim(),
      youtube: document.getElementById('youtube').value.trim(),
      selectedEmojis: selectedEmojis,
      timestamp: Date.now(),
      version: '1.0'
    };
    
    // Encode data to base64
    const jsonString = JSON.stringify(cardData);
    const encodedData = btoa(encodeURIComponent(jsonString));
    
    // Create shareable URL
    const baseUrl = window.location.origin + window.location.pathname;
    const shareUrl = `${baseUrl}?card=${encodedData}`;
    
    // Display the URL
    const urlInput = document.getElementById('shareableUrl');
    const urlContainer = document.getElementById('generatedUrlContainer');
    
    urlInput.value = shareUrl;
    urlContainer.style.display = 'block';
    
    // Scroll to URL section
    urlContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    showTemporaryMessage('Shareable URL generated!', 'success');
  } catch (error) {
    console.error('Error generating URL:', error);
    showTemporaryMessage('Error generating URL', 'error');
  }
}

// Copy share URL to clipboard
function copyShareUrl() {
  const urlInput = document.getElementById('shareableUrl');
  
  if (!urlInput.value) {
    showTemporaryMessage('No URL to copy', 'error');
    return;
  }
  
  urlInput.select();
  urlInput.setSelectionRange(0, 99999);
  
  navigator.clipboard.writeText(urlInput.value).then(() => {
    showTemporaryMessage('URL copied to clipboard!', 'success');
  }).catch(err => {
    console.error('Copy failed:', err);
    
    // Fallback for older browsers
    try {
      document.execCommand('copy');
      showTemporaryMessage('URL copied to clipboard!', 'success');
    } catch (e) {
      showTemporaryMessage('Failed to copy URL', 'error');
    }
  });
}

// Test share URL
function testShareUrl() {
  const url = document.getElementById('shareableUrl').value;
  if (url) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

// Load card from URL parameter
function loadCardFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const cardDataParam = urlParams.get('card');
  
  if (cardDataParam) {
    try {
      // Decode base64 and parse JSON
      const decodedString = decodeURIComponent(atob(cardDataParam));
      const cardData = JSON.parse(decodedString);
      
      // Update form inputs
      if (cardData.frontMessage) document.getElementById('frontInput').value = cardData.frontMessage;
      if (cardData.imageUrl) document.getElementById('imageUrl').value = cardData.imageUrl;
      if (cardData.backTitle) document.getElementById('backTitle').value = cardData.backTitle;
      if (cardData.backMessage) document.getElementById('backInput').value = cardData.backMessage;
      if (cardData.instagram) document.getElementById('instagram').value = cardData.instagram;
      if (cardData.facebook) document.getElementById('facebook').value = cardData.facebook;
      if (cardData.twitter) document.getElementById('twitter').value = cardData.twitter;
      if (cardData.youtube) document.getElementById('youtube').value = cardData.youtube;
      
      // Update emojis
      if (cardData.selectedEmojis && Array.isArray(cardData.selectedEmojis)) {
        selectedEmojis = cardData.selectedEmojis;
        updateSelectedEmojisDisplay();
        
        // Update emoji options selection state
        document.querySelectorAll('.emoji-option').forEach(option => {
          const emoji = option.dataset.emoji;
          if (selectedEmojis.includes(emoji)) {
            option.classList.add('selected');
          } else {
            option.classList.remove('selected');
          }
        });
      }
      
      // Update card display
      updateCard();
      
      // Remove URL parameter to prevent reloading
      if (history.replaceState) {
        const newUrl = window.location.pathname;
        history.replaceState(null, '', newUrl);
      }
      
      showTemporaryMessage('Card loaded from URL!', 'success');
    } catch (e) {
      console.error('Error loading card from URL:', e);
      showTemporaryMessage('Error loading card from URL', 'error');
    }
  }
}
