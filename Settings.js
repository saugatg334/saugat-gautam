// Settings System for Nepali Racer
// Handles game settings, language switching, audio controls, and preferences

class Settings {
  constructor(gameState) {
    this.gameState = gameState;
    this.audioContext = null;
    this.backgroundMusic = null;
    this.soundEffects = {};
    
    this.init();
  }
  
  init() {
    this.createSettingsUI();
    this.initAudio();
  }
  
  createSettingsUI() {
    // Create settings container
    this.settingsContainer = document.createElement('div');
    this.settingsContainer.id = 'settingsContainer';
    this.settingsContainer.className = 'settings-container';
    this.settingsContainer.style.display = 'none';
    document.body.appendChild(this.settingsContainer);
    
    // Settings header
    const header = document.createElement('div');
    header.className = 'settings-header';
    header.innerHTML = `
      <h2 id="settingsTitle">${translate('settings')}</h2>
    `;
    this.settingsContainer.appendChild(header);
    
    // Settings content
    const content = document.createElement('div');
    content.className = 'settings-content';
    
    // Language setting
    const languageSection = this.createSettingSection(
      translate('language'),
      '🌐',
      this.createLanguageSelector()
    );
    content.appendChild(languageSection);
    
    // Audio settings
    const musicSection = this.createSettingSection(
      translate('music'),
      '🎵',
      this.createToggleSwitch('music', this.gameState.musicEnabled)
    );
    content.appendChild(musicSection);
    
    const soundSection = this.createSettingSection(
      translate('sound'),
      '🔊',
      this.createToggleSwitch('sound', this.gameState.soundEnabled)
    );
    content.appendChild(soundSection);
    
    // Game stats
    const statsSection = document.createElement('div');
    statsSection.className = 'settings-section';
    statsSection.innerHTML = `
      <div class="section-header">
        <div class="section-icon">📊</div>
        <div class="section-title">Game Statistics</div>
      </div>
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-label">Games Played</div>
          <div class="stat-value">${this.gameState.gamesPlayed}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Best Score</div>
          <div class="stat-value">${this.gameState.bestScore}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Total Distance</div>
          <div class="stat-value">${Math.floor(this.gameState.totalDistance)}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Total Coins</div>
          <div class="stat-value">${this.gameState.coins}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Total Diamonds</div>
          <div class="stat-value">${this.gameState.diamonds}</div>
        </div>
      </div>
    `;
    content.appendChild(statsSection);
    
    // Reset progress
    const resetSection = document.createElement('div');
    resetSection.className = 'settings-section danger-section';
    resetSection.innerHTML = `
      <div class="section-header">
        <div class="section-icon">⚠️</div>
        <div class="section-title">${translate('resetProgress')}</div>
      </div>
      <div class="section-content">
        <p>This will permanently delete all your progress, unlocked items, and statistics.</p>
        <button class="danger-button" onclick="settings.confirmReset()">${translate('resetProgress')}</button>
      </div>
    `;
    content.appendChild(resetSection);
    
    this.settingsContainer.appendChild(content);
    
    // Close button
    const closeButton = document.createElement('button');
    closeButton.className = 'close-button';
    closeButton.innerHTML = '×';
    closeButton.onclick = () => this.hide();
    this.settingsContainer.appendChild(closeButton);
  }
  
  createSettingSection(title, icon, control) {
    const section = document.createElement('div');
    section.className = 'settings-section';
    
    section.innerHTML = `
      <div class="section-header">
        <div class="section-icon">${icon}</div>
        <div class="section-title">${title}</div>
      </div>
      <div class="section-content">
      </div>
    `;
    
    section.querySelector('.section-content').appendChild(control);
    return section;
  }
  
  createLanguageSelector() {
    const select = document.createElement('select');
    select.id = 'languageSelect';
    select.className = 'settings-select';
    
    const languages = [
      { value: 'english', label: 'English' },
      { value: 'nepali', label: 'नेपाली (Nepali)' }
    ];
    
    languages.forEach(lang => {
      const option = document.createElement('option');
      option.value = lang.value;
      option.textContent = lang.label;
      option.selected = this.gameState.language === lang.value;
      select.appendChild(option);
    });
    
    select.onchange = (e) => this.changeLanguage(e.target.value);
    
    return select;
  }
  
  createToggleSwitch(type, enabled) {
    const container = document.createElement('div');
    container.className = 'toggle-container';
    
    container.innerHTML = `
      <div class="toggle-switch ${enabled ? 'active' : ''}" onclick="settings.toggle('${type}')">
        <div class="toggle-slider"></div>
      </div>
      <span class="toggle-label">${enabled ? translate('on') : translate('off')}</span>
    `;
    
    return container;
  }
  
  changeLanguage(newLang) {
    this.gameState.setLanguage(newLang);
    this.updateLanguage();
    
    // Update all translatable elements
    this.updateAllTranslations();
  }
  
  updateAllTranslations() {
    // Update settings UI
    document.getElementById('settingsTitle').textContent = translate('settings');
    
    // Update main menu if it exists
    const mainMenuElements = {
      'startgame': 'startGame',
      'shopBtn': 'shop', 
      'settingsBtn': 'settings',
      'exit': 'exit'
    };
    
    Object.entries(mainMenuElements).forEach(([id, translationKey]) => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = translate(translationKey);
      }
    });
    
    // Update ethnic group modal
    const ethnicTitle = document.querySelector('#ethnicModal h2');
    if (ethnicTitle) {
      ethnicTitle.textContent = translate('selectEthnicGroup');
    }
    
    // Force a settings UI refresh
    this.refreshSettingsContent();
  }
  
  refreshSettingsContent() {
    if (this.settingsContainer.style.display !== 'none') {
      this.hide();
      setTimeout(() => {
        this.settingsContainer.remove();
        this.createSettingsUI();
        this.show();
      }, 100);
    }
  }
  
  toggle(type) {
    let newState;
    
    switch(type) {
      case 'music':
        newState = this.gameState.toggleMusic();
        this.updateAudioState();
        break;
      case 'sound':
        newState = this.gameState.toggleSound();
        this.updateAudioState();
        break;
    }
    
    // Update toggle UI
    const toggle = document.querySelector(`[onclick="settings.toggle('${type}')"]`);
    const label = toggle.parentElement.querySelector('.toggle-label');
    
    if (newState) {
      toggle.classList.add('active');
      label.textContent = translate('on');
    } else {
      toggle.classList.remove('active');
      label.textContent = translate('off');
    }
  }
  
  initAudio() {
    try {
      // Initialize Web Audio Context
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Create placeholder sounds (you can replace these with actual audio files)
      this.createPlaceholderSounds();
      
    } catch (error) {
      console.warn('Audio initialization failed:', error);
    }
  }
  
  createPlaceholderSounds() {
    // Create simple beep sounds for game actions
    // These are basic placeholder sounds - you can replace with actual audio files
    
    this.soundEffects = {
      coinCollect: this.createBeep(800, 0.1),
      powerUpCollect: this.createBeep(1000, 0.2),
      buttonClick: this.createBeep(600, 0.05),
      engineStart: this.createBeep(200, 0.5),
      crash: this.createBeep(100, 0.8)
    };
  }
  
  createBeep(frequency, duration) {
    return () => {
      if (!this.gameState.soundEnabled || !this.audioContext) return;
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    };
  }
  
  playSound(soundName) {
    if (this.soundEffects[soundName] && this.gameState.soundEnabled) {
      this.soundEffects[soundName]();
    }
  }
  
  updateAudioState() {
    // Control background music
    if (this.backgroundMusic) {
      if (this.gameState.musicEnabled) {
        this.backgroundMusic.play().catch(() => {}); // Ignore autoplay restrictions
      } else {
        this.backgroundMusic.pause();
      }
    }
  }
  
  confirmReset() {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone!')) {
      this.gameState.resetProgress();
    }
  }
  
  show() {
    this.settingsContainer.style.display = 'block';
  }
  
  hide() {
    this.settingsContainer.style.display = 'none';
  }
  
  isVisible() {
    return this.settingsContainer.style.display !== 'none';
  }
}

// Export for global use
window.Settings = Settings;
export default Settings;