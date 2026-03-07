const slider = document.getElementById('volumeSlider');
const valDisplay = document.getElementById('val');

slider.addEventListener('input', async () => {
  const volume = slider.value / 100;
  valDisplay.innerText = slider.value;

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: setTabVolume,
    args: [volume]
  });
});

function setTabVolume(volumeLevel) {
  if (!window.audioCtx) {
    window.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}