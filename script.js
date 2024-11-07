document.addEventListener('DOMContentLoaded', function() {
    const clickableArea = document.getElementById('clickableArea');
    const rewardDisplay = document.getElementById('reward');
    let reward = 0.00000;

    clickableArea.addEventListener('click', function() {
        reward += 0.00001;
        rewardDisplay.textContent = `Recompensa: ${reward.toFixed(5)}`;
    });
});