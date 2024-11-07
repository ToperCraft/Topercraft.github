document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('wheelCanvas');
    const ctx = canvas.getContext('2d');
    const spinButton = document.getElementById('spinButton');
    const totalWonDisplay = document.getElementById('totalWon');
    const timeRemainingDisplay = document.getElementById('timeRemaining');
    const pointer = document.getElementById('pointer');
    const rewards = [
        { text: '0.001 TCRAFT', value: 0.001, chance: 0.1 },
        { text: '0.01 TCRAFT', value: 0.01, chance: 0.05 },
        { text: '0.1 TCRAFT', value: 0.1, chance: 0.05 },
        { text: '0.5 TCRAFT', value: 0.5, chance: 0.025 },
        { text: '1 TCRAFT', value: 1, chance: 0.025 },
        { text: 'Nada', value: 0, chance: 0.8 }
    ];
    const colors = ['#FFDD57', '#FFB74D', '#FF8A65', '#4DB6AC', '#4FC3F7', '#7986CB'];
    let angle = 0;
    let spinning = false;
    let totalWon = 0;
    const lastSpinTimeKey = 'lastSpinTime';

    function drawWheel() {
        const segments = rewards.length;
        const segmentAngle = 2 * Math.PI / segments;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < segments; i++) {
            const startAngle = segmentAngle * i + angle;
            const endAngle = segmentAngle * (i + 1) + angle;

            ctx.beginPath();
            ctx.moveTo(125, 125); // Ajusta las coordenadas al nuevo tamaño del canvas
            ctx.arc(125, 125, 125, startAngle, endAngle); // Ajusta el radio al nuevo tamaño del canvas
            ctx.closePath();
            ctx.fillStyle = colors[i % colors.length]; // Utiliza colores diferentes
            ctx.fill();

            ctx.save();
            ctx.translate(125, 125);
            ctx.rotate((startAngle + endAngle) / 2);
            ctx.textAlign = 'right';
            ctx.fillStyle = 'black';
            ctx.font = '12px Arial'; // Ajusta el tamaño del texto
            ctx.fillText(rewards[i].text, 115, 5);
            ctx.restore();
        }
    }

    function spinWheel() {
        const lastSpinTime = localStorage.getItem(lastSpinTimeKey);
        if (spinning || (lastSpinTime && Date.now() - lastSpinTime < 86400000)) {
            alert('No tienes más giros. Vuelve en 24 horas.');
            return;
        }

        spinning = true;

        const spinAngleStart = Math.random() * 10 + 10;
        const spinTimeTotal = Math.random() * 3000 + 4000;
        let spinTime = 0;

        function rotate() {
            spinTime += 30;
            if (spinTime >= spinTimeTotal) {
                const finalSegment = Math.floor((angle / (2 * Math.PI)) * rewards.length) % rewards.length;
                const reward = rewards[finalSegment];
                totalWon += reward.value;
                totalWonDisplay.textContent = `Total ganado: ${totalWon.toFixed(3)} TCRAFT`;
                alert(`¡Ganaste ${reward.text}!`);
                localStorage.setItem(lastSpinTimeKey, Date.now().toString());
                spinning = false;
                pointer.style.transform = `rotate(${(finalSegment * (360 / rewards.length))}deg)`;
                return;
            }
            const spinAngle = spinAngleStart - (spinTime / spinTimeTotal) * spinAngleStart;
            angle += spinAngle * Math.PI / 180;
            angle %= 2 * Math.PI;
            drawWheel();
            requestAnimationFrame(rotate);
        }
        rotate();
    }

    function updateTimeRemaining() {
        const lastSpinTime = localStorage.getItem(lastSpinTimeKey);
        if (!lastSpinTime) {
            timeRemainingDisplay.textContent = 'Disponible';
            return;
        }

        const timeElapsed = Date.now() - lastSpinTime;
        const timeRemaining = 86400000 - timeElapsed;
        if (timeRemaining <= 0) {
            localStorage.removeItem(lastSpinTimeKey);
            timeRemainingDisplay.textContent = 'Disponible';
            return;
        }

        const hours = Math.floor(timeRemaining / 3600000);
        const minutes = Math.floor((timeRemaining % 3600000) / 60000);
        const seconds = Math.floor((timeRemaining % 60000) / 1000);

        timeRemainingDisplay.textContent = `${hours}h ${minutes}m ${seconds}s`;
        requestAnimationFrame(updateTimeRemaining);
    }

    drawWheel();
    spinButton.addEventListener('click', spinWheel);
    updateTimeRemaining();
});