/**
 * ==========================================================================
 * GSAP 3 & SCROLLTRIGGER INTERACTION SCRIPT — NHÓM 10 PORTFOLIO
 * Senior Creative Frontend Motion Choreography
 * Điểm nhấn: "Hiệu ứng xuất hiện từng thành viên sống động, ấn tượng & mượt mà"
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Đăng ký plugin ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // 2. Sử dụng gsap.context() để quản lý animation, dễ dọn dẹp và chống rò rỉ bộ nhớ
  const mainContext = gsap.context(() => {
    // 3. Khởi tạo matchMedia để phân tách Desktop & Mobile mượt mà
    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: "(min-width: 769px)",
        isMobile: "(max-width: 768px)",
        reduceMotion: "(prefers-reduced-motion: reduce)"
      },
      (context) => {
        const { isDesktop, isMobile, reduceMotion } = context.conditions;

        // Xử lý Accessibility (Reduced Motion)
        if (reduceMotion) {
          gsap.set(
            [
              ".hero-tag",
              ".hero h1",
              ".hero p",
              ".roster-list li",
              ".member-card",
              ".member-avatar",
              ".member-meta",
              ".member-bio",
              ".member-link",
              ".portfolio-table thead tr",
              ".portfolio-table tbody tr",
              ".contact-card"
            ],
            { opacity: 1, y: 0, x: 0, scale: 1, rotation: 0 }
          );
          return;
        }

        /* ------------------------------------------------------------------
         * PHẦN 1: HERO INTRO TIMELINE (Khởi chạy khi tải trang)
         * ------------------------------------------------------------------ */
        const heroTl = gsap.timeline({
          defaults: { ease: "power3.out" }
        });

        heroTl
          .fromTo(
            ".hero-tag",
            { y: -15, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, ease: "power2.out" }
          )
          .fromTo(
            ".hero h1",
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" },
            "-=0.3"
          )
          .fromTo(
            ".hero p",
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
            "<0.2"
          )
          .fromTo(
            ".roster-list li",
            { scale: 0.9, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.55,
              stagger: 0.1,
              ease: "back.out(1.7)",
              clearProps: "opacity,transform"
            },
            "-=0.3"
          );

        /* ------------------------------------------------------------------
         * ĐIỂM NHẤN 1: SEQUENTIAL MEMBER REVEAL (XUẤT HIỆN TUẦN TỰ TỪNG CARD)
         * Khi cuộn tới "Thông tin chi tiết thành viên"
         * ------------------------------------------------------------------ */
        const memberCards = gsap.utils.toArray(".member-card");
        const rosterItems = gsap.utils.toArray(".roster-list li");

        // Master Timeline cho phần thành viên gắn liền với ScrollTrigger
        const memberRevealTl = gsap.timeline({
          scrollTrigger: {
            trigger: ".members-grid",
            start: "top 78%",
            toggleActions: "play none none none",
            once: true
          }
        });

        memberCards.forEach((card, index) => {
          const avatar = card.querySelector(".member-avatar");
          const meta = card.querySelector(".member-meta");
          const bio = card.querySelector(".member-bio");
          const link = card.querySelector(".member-link");

          // Nhịp điệu trễ 0.28s giữa mỗi card tạo cảm giác nối tiếp ấn tượng
          const cardStartTime = index * 0.28;

          // 1.1 Khung card chính trượt lên, scale từ 0.9 -> 1, xoay nhẹ -> 0deg nảy back.out(1.4)
          memberRevealTl.fromTo(
            card,
            {
              y: 60,
              opacity: 0,
              scale: 0.9,
              rotation: index % 2 === 0 ? 2 : -2
            },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              rotation: 0,
              duration: 0.85,
              ease: "back.out(1.4)"
            },
            cardStartTime
          );

          // 1.2 Micro-stagger bên trong từng card:
          // Avatar bung nở ra trước
          if (avatar) {
            memberRevealTl.fromTo(
              avatar,
              { scale: 0, opacity: 0 },
              {
                scale: 1,
                opacity: 1,
                duration: 0.5,
                ease: "back.out(2)"
              },
              cardStartTime + 0.15
            );
          }

          // Tên & Badge trượt nhẹ lên
          if (meta) {
            memberRevealTl.fromTo(
              meta,
              { y: 15, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.45,
                ease: "power2.out"
              },
              cardStartTime + 0.25
            );
          }

          // Đoạn mô tả fade in
          if (bio) {
            memberRevealTl.fromTo(
              bio,
              { y: 15, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.45,
                ease: "power2.out"
              },
              cardStartTime + 0.35
            );
          }

          // Nút Xem trang cá nhân hiện lên
          if (link) {
            memberRevealTl.fromTo(
              link,
              { y: 15, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.45,
                ease: "power2.out"
              },
              cardStartTime + 0.45
            );
          }
        });

        /* ------------------------------------------------------------------
         * ĐIỂM NHẤN 2: LIÊN KẾT TƯƠNG TÁC (PILL 01-04 KẾT NỐI VỚI CARD CHI TIẾT)
         * Hover/Click ở trên -> Spotlight Card tương ứng ở dưới
         * ------------------------------------------------------------------ */
        rosterItems.forEach((pill, idx) => {
          const targetCard = memberCards[idx];
          if (!targetCard) return;

          // Khi HOVER vào Pill phía trên
          pill.addEventListener("mouseenter", () => {
            // Pill nhận trạng thái Active
            gsap.to(pill, {
              scale: 1.05,
              backgroundColor: "#ffffff",
              borderColor: "#2563eb",
              boxShadow: "0 10px 24px -2px rgba(37, 99, 235, 0.22)",
              duration: 0.25,
              ease: "power2.out",
              overwrite: "auto"
            });

            // Card tương ứng được "Spotlight" (scale 1.03, viền sáng, bóng xanh rực rỡ)
            gsap.to(targetCard, {
              scale: 1.03,
              boxShadow: "0 22px 48px -6px rgba(37, 99, 235, 0.32), 0 0 0 2px #2563eb",
              borderColor: "#2563eb",
              opacity: 1,
              duration: 0.35,
              ease: "back.out(1.5)",
              overwrite: "auto"
            });

            // Rung nhẹ (jolt) tạo chú ý thị giác
            gsap.fromTo(
              targetCard,
              { rotation: -1 },
              {
                rotation: 1,
                duration: 0.08,
                repeat: 3,
                yoyo: true,
                ease: "sine.inOut",
                onComplete: () => {
                  gsap.to(targetCard, { rotation: 0, duration: 0.15 });
                }
              }
            );

            // 3 Card còn lại mờ đi (opacity: 0.45)
            memberCards.forEach((otherCard, otherIdx) => {
              if (otherIdx !== idx) {
                gsap.to(otherCard, {
                  opacity: 0.45,
                  scale: 0.98,
                  duration: 0.35,
                  ease: "power2.out",
                  overwrite: "auto"
                });
              }
            });
          });

          // Khi RỜI CHUỘT khỏi Pill
          pill.addEventListener("mouseleave", () => {
            // Trả Pill về trạng thái bình thường
            gsap.to(pill, {
              scale: 1,
              backgroundColor: "rgba(255, 255, 255, 0.86)",
              borderColor: "rgba(226, 232, 240, 0.9)",
              boxShadow: "0 2px 4px rgba(15, 23, 42, 0.04)",
              duration: 0.3,
              ease: "power2.out",
              overwrite: "auto"
            });

            // Trả toàn bộ 4 Card về trạng thái bình thường
            memberCards.forEach((card) => {
              gsap.to(card, {
                opacity: 1,
                scale: 1,
                rotation: 0,
                boxShadow: "0 6px 20px -2px rgba(15, 23, 42, 0.06)",
                borderColor: "rgba(226, 232, 240, 0.9)",
                duration: 0.35,
                ease: "power2.out",
                overwrite: "auto"
              });
            });
          });

          // Khi CLICK vào Pill: Cuộn mượt (Smooth Scroll) tới Card tương ứng
          pill.addEventListener("click", () => {
            targetCard.scrollIntoView({
              behavior: "smooth",
              block: "center"
            });

            // Hiệu ứng sáng bừng nhẹ báo hiệu vị trí
            gsap.fromTo(
              targetCard,
              { filter: "brightness(1.15)" },
              { filter: "brightness(1)", duration: 0.8, ease: "power2.out" }
            );
          });
        });

        /* ------------------------------------------------------------------
         * ĐIỂM NHẤN 3: HOVER 3D TILT TRÊN TỪNG CARD BẰNG GSAP QUICKTO
         * ------------------------------------------------------------------ */
        memberCards.forEach((card) => {
          const avatar = card.querySelector(".member-avatar");
          const arrow = card.querySelector(".member-link .arrow");
          let arrowTween = null;

          // Chuẩn bị quickTo cho chuyển động 3D Tilt siêu mượt 60fps
          const xRotateTo = gsap.quickTo(card, "rotationX", {
            duration: 0.35,
            ease: "power1.out"
          });
          const yRotateTo = gsap.quickTo(card, "rotationY", {
            duration: 0.35,
            ease: "power1.out"
          });

          card.addEventListener("mouseenter", () => {
            // 3.1 Avatar xoay nhẹ & phóng to (scale: 1.08, rotate: 2deg)
            if (avatar) {
              gsap.to(avatar, {
                scale: 1.08,
                rotation: 2,
                duration: 0.4,
                ease: "power2.out",
                overwrite: "auto"
              });
            }

            // 3.2 Mũi tên trượt sang phải 6px lặp nhịp nhàng (yoyo loop)
            if (arrow) {
              arrowTween = gsap.to(arrow, {
                x: 6,
                duration: 0.4,
                ease: "sine.inOut",
                repeat: -1,
                yoyo: true
              });
            }
          });

          card.addEventListener("mouseleave", () => {
            // Reset Avatar
            if (avatar) {
              gsap.to(avatar, {
                scale: 1,
                rotation: 0,
                duration: 0.4,
                ease: "power2.out",
                overwrite: "auto"
              });
            }

            // Dừng lặp mũi tên và đưa về vị trí ban đầu
            if (arrowTween) {
              arrowTween.kill();
              gsap.to(arrow, { x: 0, duration: 0.25, ease: "power2.out" });
            }

            // Reset góc nghiêng 3D Tilt
            if (isDesktop) {
              xRotateTo(0);
              yRotateTo(0);
            }
          });

          // 3.3 3D Tilt theo toạ độ con trỏ chuột (Chỉ chạy trên Desktop)
          if (isDesktop) {
            card.addEventListener("mousemove", (e) => {
              const rect = card.getBoundingClientRect();
              const mouseX = e.clientX - rect.left;
              const mouseY = e.clientY - rect.top;
              const centerX = rect.width / 2;
              const centerY = rect.height / 2;

              // Tính góc nghiêng (giới hạn ±6 độ)
              const rotX = ((mouseY - centerY) / centerY) * -6;
              const rotY = ((mouseX - centerX) / centerX) * 6;

              xRotateTo(rotX);
              yRotateTo(rotY);
            });
          }
        });

        /* ------------------------------------------------------------------
         * PHẦN 4: BẢNG PHÂN CÔNG CÔNG VIỆC
         * ------------------------------------------------------------------ */
        const tableTl = gsap.timeline({
          scrollTrigger: {
            trigger: ".table-card",
            start: "top 80%",
            toggleActions: "play none none none",
            once: true
          }
        });

        tableTl
          .from(".portfolio-table thead tr", {
            y: -25,
            opacity: 0,
            duration: 0.65,
            ease: "power2.out"
          })
          .from(
            ".portfolio-table tbody tr",
            {
              x: -25,
              opacity: 0,
              duration: 0.55,
              stagger: 0.1,
              ease: "power2.out"
            },
            "-=0.2"
          );

        /* ------------------------------------------------------------------
         * PHẦN 5: FORM LIÊN HỆ
         * ------------------------------------------------------------------ */
        gsap.from(".contact-card", {
          scrollTrigger: {
            trigger: ".contact-card",
            start: "top 85%",
            toggleActions: "play none none none",
            once: true
          },
          y: 40,
          opacity: 0,
          duration: 0.85,
          ease: "power3.out"
        });
      }
    );
  }); // Kết thúc gsap.context()

  // Dọn dẹp an toàn khi unload trang
  window.addEventListener("beforeunload", () => {
    mainContext.revert();
  });
});
