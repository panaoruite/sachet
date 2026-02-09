// ========== 移动端汉堡导航逻辑 ==========
$(function() {
  const $hamburger = $("#hamburger");
  const $nav = $("#nav");
  const $navMask = $("#navMask");
  const $navLinks = $(".nav a");

  // 打开/关闭导航
  $hamburger.click(function() {
    $(this).toggleClass("active");
    if ($(this).hasClass("active")) {
      $nav.css("transform", "translateX(0)");
      $navMask.show();
      $("body").css("overflow", "hidden"); // 禁止背景滚动
    } else {
      $nav.css("transform", "translateX(100%)");
      $navMask.hide();
      $("body").css("overflow", "auto");
    }
  });

  // 点击遮罩关闭导航
  $navMask.click(function() {
    $hamburger.removeClass("active");
    $nav.css("transform", "translateX(100%)");
    $(this).hide();
    $("body").css("overflow", "auto");
  });

  // 点击导航链接关闭导航
  $navLinks.click(function() {
    $hamburger.removeClass("active");
    $nav.css("transform", "translateX(100%)");
    $navMask.hide();
    $("body").css("overflow", "auto");
  });

  // 窗口resize时重置导航状态
  $(window).resize(function() {
    if ($(window).width() > 768) {
      $hamburger.removeClass("active");
      $nav.css("transform", "translateX(0)"); // PC端导航默认显示
      $navMask.hide();
      $("body").css("overflow", "auto");
    } else {
      $nav.css("transform", "translateX(100%)"); // 移动端默认隐藏导航
    }
  }).resize(); // 初始化执行一次
});

// ========== 原有JS逻辑（导航高亮、回到顶部等） ==========
// ... 原有代码保持不变 ...

// ========== 公共交互逻辑 ==========
$(function() {
  // 1. 导航高亮（根据当前页面URL匹配）
  const currentUrl = window.location.href;
  const navLinks = $(".nav a");
  navLinks.each(function() {
    const linkUrl = $(this).attr("href");
    if (currentUrl.includes(linkUrl)) {
      $(this).addClass("active");
    }
  });

  // 2. 回到顶部按钮
  const backToTop = $(".back-to-top");
  $(window).scroll(function() {
    if ($(this).scrollTop() > 300) {
      backToTop.fadeIn();
    } else {
      backToTop.fadeOut();
    }
  });

  backToTop.click(function() {
    $("html, body").animate({ scrollTop: 0 }, 500);
  });

  // 3. 首页轮播图（仅在首页执行）
  if ($(".banner .swiper").length > 0) {
    const swiper = new Swiper('.banner .swiper', {
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
  }

  // ========== AR教学页交互逻辑 ==========
  // 1. AR体验弹窗
  const $arBtn = $("#arExperienceBtn");
  const $arModal = $("#arModal");
  const $arModalClose = $("#arModalClose");
  const $arModalBtn = $("#arModalBtn");

  // 打开弹窗
  $arBtn.click(function() {
    $arModal.css("display", "flex");
    $("body").css("overflow", "hidden"); // 禁止背景滚动
  });

  // 关闭弹窗（关闭按钮/我知道了）
  $arModalClose.click(function() {
    $arModal.css("display", "none");
    $("body").css("overflow", "auto");
  });
  $arModalBtn.click(function() {
    $arModal.css("display", "none");
    $("body").css("overflow", "auto");
  });

  // 点击弹窗外部关闭
  $(window).click(function(e) {
    if (e.target === $arModal[0]) {
      $arModal.css("display", "none");
      $("body").css("overflow", "auto");
    }
  });

  // ========== 作品广场页交互逻辑 ==========
  // 1. 作品分类筛选
  const $filterItems = $(".filter-item");
  const $worksItems = $(".works-item");

  $filterItems.click(function() {
    // 切换筛选项active状态
    $filterItems.removeClass("active");
    $(this).addClass("active");
    const filterCategory = $(this).data("filter");

    // 筛选作品
    $worksItems.each(function() {
      const workCategory = $(this).data("category");
      if (filterCategory === "all" || filterCategory === workCategory) {
        $(this).fadeIn(300);
      } else {
        $(this).fadeOut(300);
      }
    });
  });

  // 2. 作品详情弹窗
  const $worksModal = $("#worksModal");
  const $worksModalClose = $("#worksModalClose");
  const $modalImg = $("#modalImg");
  const $modalTitle = $("#modalTitle");
  const $modalAuthor = $("#modalAuthor");
  const $modalCraft = $("#modalCraft");
  const $modalDesc = $("#modalDesc");
  const $modalCraftDetail = $("#modalCraftDetail");

  // 点击作品卡片打开弹窗
  $worksItems.click(function() {
    const imgSrc = $(this).find(".works-img").attr("src");
    const title = $(this).find(".works-title").text();
    const author = $(this).find(".works-author").text();
    const craft = $(this).find(".works-craft").text();
    const desc = $(this).find(".works-desc").text();
    const category = $(this).data("category");

    // 填充弹窗内容
    $modalImg.attr("src", imgSrc).attr("alt", title);
    $modalTitle.text(title);
    $modalAuthor.html(`👤 ${author}`);
    $modalCraft.html(`🧵 ${craft}`);
    $modalDesc.text(desc);

    // 动态生成工艺细节
    let craftDetail = "";
    if (category === "生肖") {
      craftDetail = "生肖香包以十二生肖为原型，采用庆阳传统平针、打籽针绣制，造型灵动，色彩以红、黄、绿为主，融合吉祥纹样，是庆阳香包最具代表性的品类之一。";
    } else if (category === "福寿") {
      craftDetail = "福寿香包融合牡丹、寿桃、蝙蝠、松鹤等吉祥纹样，采用锁针、辫针绣制，造型饱满，寓意富贵长寿，是庆阳民间祝寿、祈福的经典作品。";
    } else if (category === "五毒") {
      craftDetail = "五毒香包绣制蛇、蝎、蜈蚣、壁虎、蟾蜍五毒纹样，内置艾草、菖蒲等香料，采用立体刺绣工艺，是庆阳端午驱邪避瘟的传统民俗香包。";
    } else if (category === "民俗") {
      craftDetail = "民俗香包紧扣庆阳婚嫁、端午、春节等民俗场景，纹样贴合民俗寓意，绣工兼具粗犷与细腻，是庆阳民俗文化的活态载体。";
    } else if (category === "布艺") {
      craftDetail = "布艺香包以纯棉粗布为原料，采用纯手工拼接+刺绣工艺，造型立体，质感质朴，兼具装饰与实用价值，是庆阳传统布艺工艺的结晶。";
    }
    $modalCraftDetail.text(craftDetail);

    // 显示弹窗
    $worksModal.css("display", "flex");
    $("body").css("overflow", "hidden");
  });

  // 关闭作品弹窗（关闭按钮/外部点击）
  $worksModalClose.click(function() {
    $worksModal.css("display", "none");
    $("body").css("overflow", "auto");
  });
  $(window).click(function(e) {
    if (e.target === $worksModal[0]) {
      $worksModal.css("display", "none");
      $("body").css("overflow", "auto");
    }
  });

  // 3. 分页交互
  const $pageItems = $(".page-item:not(.page-prev):not(.page-next)");
  const $pagePrev = $(".page-prev");
  const $pageNext = $(".page-next");

  $pageItems.click(function() {
    $pageItems.removeClass("active");
    $(this).addClass("active");
    // 重置上一页/下一页禁用状态
    $pagePrev.removeClass("page-disabled");
    $pageNext.removeClass("page-disabled");
    if ($(this).text() === "1") $pagePrev.addClass("page-disabled");
    if ($(this).text() === "3") $pageNext.addClass("page-disabled");
  });

  // 上一页/下一页
  $pagePrev.click(function() {
    if (!$(this).hasClass("page-disabled")) {
      const currentPage = parseInt($(".page-item.active").text());
      if (currentPage > 1) {
        $(`.page-item:contains(${currentPage - 1})`).click();
      }
    }
  });
  $pageNext.click(function() {
    if (!$(this).hasClass("page-disabled")) {
      const currentPage = parseInt($(".page-item.active").text());
      if (currentPage < 3) {
        $(`.page-item:contains(${currentPage + 1})`).click();
      }
    }
  });
});
