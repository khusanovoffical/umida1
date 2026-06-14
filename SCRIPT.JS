
        const canvas = document.getElementById('particleCanvas');
        const ctx = canvas.getContext('2d');
        const welcomeOverlay = document.getElementById('welcome-overlay');
        const okBtn = document.getElementById('ok-btn');
        const heartText = document.getElementById('heart-text');
        const hint = document.getElementById('hint');

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        let particles = [];
        const particleCount = 1200; // Zarachalar soni (yurak shakli to'liq chiqishi uchun)
        let mode = 'random'; // 'random' yoki 'heart'
        let hasClicked = false;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        // Matematik yurak formulasi koordinatalarini olish
        function getHeartPoint(t) {
            // t: 0 dan 2*PI gacha
            // Yurak formulasini kattalashtirish va markazga moslash
            const scale = Math.min(width, height) / 28; 
            const x = 16 * Math.pow(Math.sin(t), 3);
            const y = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
            return {
                x: width / 2 + x * scale,
                y: height / 2 - y * scale // Canvasda Y o'qi pastga yo'nalgani uchun ayiramiz
            };
        }

        // Zaracha klassi
        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                // Tasodifiy harakat tezligi
                this.vx = (Math.random() - 0.5) * 1.5;
                this.vy = (Math.random() - 0.5) * 1.5;
                this.radius = Math.random() * 2 + 1;
                
                // Yurak shaklidagi maqsad nuqtasi
                const targetT = Math.random() * Math.PI * 2;
                this.target = getHeartPoint(targetT);
                
                // Harakat silliqligi (speed coefficient)
                this.speed = Math.random() * 0.04 + 0.02;
            }

            update() {
                if (mode === 'random') {
                    // Devorlardan qaytish
                    this.x += this.vx;
                    this.y += this.vy;

                    if (this.x < 0 || this.x > width) this.vx *= -1;
                    if (this.y < 0 || this.y > height) this.vy *= -1;
                } else if (mode === 'heart') {
                    // Yurak shakliga yig'ilish animatsiyasi (Lerp)
                    this.x += (this.target.x - this.x) * this.speed;
                    this.y += (this.target.y - this.y) * this.speed;
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
                ctx.fill();
            }
        }

        // Zarachalarni yaratish
        function init() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        // Animatsiya sikli
        function animate() {
            ctx.clearRect(0, 0, width, height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            requestAnimationFrame(animate);
        }

        // OK tugmasi bosilganda
        okBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // OnClick fon hodisasini qo'zg'atmasligi uchun
            welcomeOverlay.style.opacity = '0';
            setTimeout(() => {
                welcomeOverlay.style.display = 'none';
                hint.style.opacity = '1'; // "Ekranga bosing" yozuvini ko'rsatish
            }, 800);
        });

        // Ekran bosilganda yurak hosil bo'lishi
        document.body.addEventListener('click', () => {
            if (welcomeOverlay.style.display === 'none' && !hasClicked) {
                hasClicked = true;
                mode = 'heart';
                hint.style.opacity = '0';

                // 0.5 soniyadan keyin matn chiqishi va nafis effektlar
                setTimeout(() => {
                    heartText.classList.add('show');
                    triggerPulseEffect();
                }, 500);
            }
        });

        // Yurak yig'ilganda unga qo'shimcha "gulfillash" (pulse) effekti berish
        function triggerPulseEffect() {
            // Zarachalarni bir muddat nafis siljitish
            particles.forEach(p => {
                p.speed = 0.08; // Tezlikni oshirish (yurakka mahkamroq yopishishi uchun)
            });
        }

        // Dasturni ishga tushirish
        init();
        animate();
   