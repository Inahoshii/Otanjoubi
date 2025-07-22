document.addEventListener('DOMContentLoaded', () => {
    
    // --- Variabel Elemen (Tanpa Musik) ---
    const giftContainer = document.getElementById('gift-container');
    const preBookGifScreen = document.getElementById('pre-book-gif-screen');
    const bookContainer = document.getElementById('book-container');
    const book = document.getElementById('book');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const pages = document.querySelectorAll('.page');
    const finalScreen = document.getElementById('final-screen');
    const replayBtn = document.getElementById('replay-btn');
    
    let currentPage = 0;
    const totalPages = pages.length;

    // Mengatur tumpukan halaman awal
    pages.forEach((page, index) => {
        page.style.zIndex = totalPages - index;
    });

    prevBtn.style.display = 'none';

    // --- ALUR BARU TANPA MUSIK ---

    // 1. Saat Kado Diklik
    giftContainer.addEventListener('click', () => {
        giftContainer.classList.add('magic-effect');
        
        setTimeout(() => {
            giftContainer.classList.remove('visible');
            giftContainer.classList.add('hidden');
            
            // Langsung tampilkan layar GIF
            preBookGifScreen.classList.remove('hidden');
            preBookGifScreen.classList.add('visible');

            // 2. Setelah GIF selesai, picu animasi buku
            setTimeout(() => {
                preBookGifScreen.classList.remove('visible');
                preBookGifScreen.classList.add('hidden');

                // Tampilkan buku dan jalankan animasi baru
                bookContainer.classList.remove('hidden');
                bookContainer.classList.add('book-enter-animation'); // [REVISI] Ganti nama kelas animasi
            }, 4500); // Durasi GIF

        }, 500);
    });

    // --- Sisa Kode (Logika Buku, Kupu-kupu, dll.) tidak berubah ---

    const goNextPage = () => {
        if (currentPage < totalPages) {
            createButterflies();
            const pageToFlip = pages[currentPage];
            pageToFlip.classList.add('flipped');
            pageToFlip.style.zIndex = currentPage + totalPages;
            currentPage++;
            updateButtons();

            if (currentPage === totalPages) {
                setTimeout(() => {
                    book.style.opacity = '0';
                    prevBtn.style.display = 'none';
                    nextBtn.style.display = 'none';

                    setTimeout(() => {
                        finalScreen.classList.remove('hidden');
                        finalScreen.classList.add('visible');
                        startFinalAnimation();
                    }, 500);
                    
                }, 1000); 
            }
        }
    };

    const goPrevPage = () => {
        if (currentPage > 0) {
            createButterflies();
            currentPage--;
            const pageToUnflip = pages[currentPage];
            pageToUnflip.classList.remove('flipped');
            pageToUnflip.style.zIndex = totalPages - currentPage;
            updateButtons();
        }
    };
    
    const updateButtons = () => {
        prevBtn.style.display = (currentPage === 0) ? 'none' : 'block';
        if (currentPage === totalPages) {
            nextBtn.style.display = 'none';
        } else {
            nextBtn.style.display = 'block';
        }
    };

    nextBtn.addEventListener('click', goNextPage);
    prevBtn.addEventListener('click', goPrevPage);
    
    replayBtn.addEventListener('click', () => {
        location.reload();
    });

    function createButterflies() {
        const bookRect = book.getBoundingClientRect();
        const spineX = bookRect.left + (bookRect.width / 2);
        const spineY = bookRect.top + (bookRect.height / 2);
        
        for (let i = 0; i < 7; i++) {
            const butterfly = document.createElement('div');
            butterfly.classList.add('butterfly');
            butterfly.innerHTML = '🦋';
            butterfly.style.left = spineX + 'px';
            butterfly.style.top = spineY + 'px';

            const randomX = (Math.random() - 0.5) * 400;
            const randomY = (Math.random() - 0.5) * 400;
            const randomRot = (Math.random() - 0.5) * 360;
            const randomDelay = Math.random() * 0.3;

            butterfly.style.setProperty('--tx', randomX + 'px');
            butterfly.style.setProperty('--ty', randomY + 'px');
            butterfly.style.setProperty('--rot', randomRot + 'deg');
            butterfly.style.animationDelay = randomDelay + 's';

            document.body.appendChild(butterfly);

            setTimeout(() => {
                butterfly.remove();
            }, 2300);
        }
    }

    const canvas = document.getElementById('magic-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray = [];
    const colors = ['#F8C8DC', '#D8BFD8', '#FFFACD', '#ffffff'];

    class Particle {
        constructor(x, y, size, color, weight) {
            this.x = x; this.y = y; this.size = size; this.color = color; this.weight = weight;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        update() {
            this.y -= this.weight;
            if (this.y < -this.size) {
                this.y = canvas.height + this.size;
                this.x = Math.random() * canvas.width;
            }
            this.draw();
        }
    }

    function init() {
        particlesArray = [];
        const numberOfParticles = 100;
        for (let i = 0; i < numberOfParticles; i++) {
            const size = Math.random() * 3 + 1;
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const weight = Math.random() * 0.5 + 0.1;
            particlesArray.push(new Particle(x, y, size, color, weight));
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        requestAnimationFrame(animate);
    }

    init();
    animate();

    function startFinalAnimation() {
        const finalCanvas = document.getElementById('final-animation-canvas');
        const finalCtx = finalCanvas.getContext('2d');
        finalCanvas.width = window.innerWidth;
        finalCanvas.height = window.innerHeight;
        let finalAnimationElements = [];

        class Petal {
            constructor() {
                this.x = Math.random() * finalCanvas.width;
                this.y = (Math.random() * finalCanvas.height * 2) - finalCanvas.height;
                this.w = 15 + Math.random() * 10; this.h = 10 + Math.random() * 5;
                this.opacity = this.w / 25; this.flip = Math.random();
                this.xSpeed = 1.5 + Math.random(); this.ySpeed = 1 + Math.random() * 0.5;
                this.flipSpeed = Math.random() * 0.03;
            }
            draw() {
                if (this.y > finalCanvas.height || this.x > finalCanvas.width) {
                    this.x = -this.w;
                    this.y = (Math.random() * finalCanvas.height * 2) - finalCanvas.height;
                }
                finalCtx.globalAlpha = this.opacity;
                finalCtx.beginPath();
                finalCtx.ellipse(this.x, this.y, this.w, this.h, Math.PI / 10, 0, 2 * Math.PI);
                finalCtx.fillStyle = 'rgba(255, 192, 203, 0.9)';
                finalCtx.fill();
            }
            animate() {
                this.x += this.xSpeed; this.y += this.ySpeed;
                this.flip += this.flipSpeed;
                this.w = this.w + Math.sin(this.flip) * 0.5;
                this.draw();
            }
        }

        class LightButterfly {
            constructor() {
                this.x = Math.random() * finalCanvas.width;
                this.y = Math.random() * finalCanvas.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = Math.random() * 2 - 1; this.speedY = Math.random() * 2 - 1;
            }
            draw() {
                finalCtx.beginPath();
                finalCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                finalCtx.fillStyle = `rgba(255, 255, 255, ${Math.random()})`;
                finalCtx.fill();
            }
            animate() {
                this.x += this.speedX; this.y += this.speedY;
                if (this.x < 0 || this.x > finalCanvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > finalCanvas.height) this.speedY *= -1;
                this.draw();
            }
        }

        for(let i = 0; i < 25; i++) { finalAnimationElements.push(new Petal()); }
        for(let i = 0; i < 30; i++) { finalAnimationElements.push(new LightButterfly()); }

        function finalLoop() {
            finalCtx.clearRect(0, 0, finalCanvas.width, finalCanvas.height);
            finalAnimationElements.forEach(el => el.animate());
            requestAnimationFrame(finalLoop);
        }
        finalLoop();

        window.addEventListener('resize', () => {
            finalCanvas.width = window.innerWidth;
            finalCanvas.height = window.innerHeight;
        });
    }

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init();
    });
});