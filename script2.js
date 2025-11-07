class ModernStopwatch {
    constructor() {
        // DOM elements
        this.minutesEl = document.getElementById('minutes');
        this.secondsEl = document.getElementById('seconds');
        this.centisecondsEl = document.getElementById('centiseconds');
        this.startBtn = document.getElementById('startBtn');
        this.lapBtn = document.getElementById('lapBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.lapsList = document.getElementById('lapsList');

        // Stopwatch state
        this.centiseconds = 0;
        this.seconds = 0;
        this.minutes = 0;
        this.isRunning = false;
        this.interval = null;
        this.laps = [];
        this.lastLapTime = 0;
        this.totalTime = 0;

        // Bind event listeners
        this.startBtn.addEventListener('click', () => this.toggleStartPause());
        this.lapBtn.addEventListener('click', () => this.recordLap());
        this.resetBtn.addEventListener('click', () => this.reset());

        // Initial button states
        this.updateButtonStates();
    }

    toggleStartPause() {
        if (this.isRunning) {
            this.pause();
        } else {
            this.start();
        }
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.interval = setInterval(() => this.updateTime(), 10);
            this.startBtn.querySelector('i').classList.remove('fa-play');
            this.startBtn.querySelector('i').classList.add('fa-pause');
            this.startBtn.classList.add('active');
            this.updateButtonStates();
        }
    }

    pause() {
        if (this.isRunning) {
            this.isRunning = false;
            clearInterval(this.interval);
            this.startBtn.querySelector('i').classList.remove('fa-pause');
            this.startBtn.querySelector('i').classList.add('fa-play');
            this.startBtn.classList.remove('active');
            this.updateButtonStates();
        }
    }

    reset() {
        this.pause();
        this.centiseconds = 0;
        this.seconds = 0;
        this.minutes = 0;
        this.laps = [];
        this.lastLapTime = 0;
        this.totalTime = 0;
        this.updateDisplay();
        this.lapsList.innerHTML = '';
        this.updateButtonStates();
    }

    updateTime() {
        this.centiseconds++;
        if (this.centiseconds === 100) {
            this.centiseconds = 0;
            this.seconds++;
            if (this.seconds === 60) {
                this.seconds = 0;
                this.minutes++;
            }
        }
        this.totalTime = (this.minutes * 6000) + (this.seconds * 100) + this.centiseconds;
        this.updateDisplay();
    }

    updateDisplay() {
        this.minutesEl.textContent = this.padNumber(this.minutes);
        this.secondsEl.textContent = this.padNumber(this.seconds);
        this.centisecondsEl.textContent = this.padNumber(this.centiseconds);
    }

    recordLap() {
        if (this.isRunning) {
            const currentTime = this.totalTime;
            const lapTime = currentTime - this.lastLapTime;
            
            this.laps.push({
                number: this.laps.length + 1,
                lapTime: lapTime,
                totalTime: currentTime
            });

            this.lastLapTime = currentTime;
            this.updateLapsDisplay();
        }
    }

    updateLapsDisplay() {
        this.lapsList.innerHTML = '';
        
        // Find fastest and slowest laps
        let lapTimes = this.laps.map(lap => lap.lapTime);
        let fastestLap = Math.min(...lapTimes);
        let slowestLap = Math.max(...lapTimes);

        // Display laps in reverse order (newest first)
        [...this.laps].reverse().forEach(lap => {
            const lapItem = document.createElement('div');
            lapItem.className = 'lap-item';
            
            // Add fastest/slowest class
            if (lap.lapTime === fastestLap && this.laps.length > 2) {
                lapItem.classList.add('fastest');
            } else if (lap.lapTime === slowestLap && this.laps.length > 2) {
                lapItem.classList.add('slowest');
            }
            
            lapItem.innerHTML = `
                <span>Lap ${lap.number}</span>
                <span>${this.formatTime(lap.totalTime)}</span>
                <span>${this.formatTime(lap.lapTime)}</span>
            `;
            this.lapsList.appendChild(lapItem);
        });
    }

    updateButtonStates() {
        this.lapBtn.disabled = !this.isRunning;
        this.resetBtn.disabled = this.isRunning;
    }

    formatTime(timeInCentiseconds) {
        const minutes = Math.floor(timeInCentiseconds / 6000);
        const seconds = Math.floor((timeInCentiseconds % 6000) / 100);
        const centiseconds = timeInCentiseconds % 100;
        return `${this.padNumber(minutes)}:${this.padNumber(seconds)}.${this.padNumber(centiseconds)}`;
    }

    padNumber(number) {
        return number.toString().padStart(2, '0');
    }
}

// Initialize the stopwatch when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ModernStopwatch();
});