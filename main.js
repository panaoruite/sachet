/**
 * 庆阳香包网站核心交互脚本
 * 功能模块：
 * 1. 移动端汉堡导航
 * 2. 公共交互（导航高亮、回到顶部）
 * 3. 首页轮播图
 * 4. AR教学页弹窗交互
 * 5. 作品广场页（筛选、弹窗、分页）
 */

// ==============================================
// 1. 全局常量定义（复用的DOM选择器，便于维护）
// ==============================================
const DOM_SELECTORS = {
  hamburger: $("#hamburger"),
  nav: $("#nav"),
  navMask: $("#navMask"),
  navLinks: $(".nav a"),
  backToTop: $(".back-to-top"),
  // AR教学页
  arBtn: $("#arExperienceBtn"),
  arModal: $("#arModal"),
  arModalClose: $("#arModalClose"),
  arModalBtn: $("#arModalBtn"),
  // 作品广场页
  filterItems: $(".filter-item"),
  worksItems: $(".works-item"),
  worksModal: $("#worksModal"),
  worksModalClose: $("#worksModalClose"),
  modalImg: $("#modalImg"),
  modalTitle: $("#modalTitle"),
  modalAuthor: $("#modalAuthor"),
  modalCraft: $("#modalCraft"),
  modalDesc: $("#modalDesc"),
  modalCraftDetail: $("#modalCraftDetail"),
  pageItems: $(".page-item:not(.page-prev):not(.page-next)"),
  pagePrev: $(".page-prev"),
  pageNext: $(".page-next")
};

// ==============================================
// 2. 移动端汉堡导航逻辑
// ==============================================
function initMobileNav() {
  const { hamburger, nav, navMask, navLinks } = DOM_SELECTORS;

  // 打开/关闭导航菜单
  hamburger.click(function() {
    $(this).toggleClass("active");
    const isActive = $(this).hasClass("active");
    
    // 切换导航显示/隐藏
    nav.css("transform", isActive ? "translateX(0)" : "translateX(100%)");
    navMask.toggle(isActive);
    // 禁止/恢复背景滚动
    $("body").css("overflow", isActive ? "hidden" : "auto");
  });

  // 点击遮罩关闭导航
  navMask.click(function() {
    hamburger.removeClass("active");
    nav.css("transform", "translateX(100%)");
    $(this).hide();
    $("body").css("overflow", "auto");
  });

  // 点击导航链接关闭菜单
  navLinks.click(function() {
    hamburger.removeClass("active");
    nav.css("transform", "translateX(100%)");
    navMask.hide();
    $("body").css("overflow", "auto");
  });

  // 窗口大小变化时重置导航状态
  $(window).resize(function() {
    const isPc = $(window).width() > 768;
    hamburger.removeClass("active");
    navMask.hide();
    $("body").css("overflow", "auto");
    
    // PC端显示导航，移动端隐藏导航
    nav.css("transform", isPc ? "translateX(0)" : "translateX(100%)");
  }).resize(); // 初始化时执行一次
}

// ==============================================
// 3. 公共交互逻辑（全页面复用）
// ==============================================
function initCommonInteraction() {
  const { backToTop, navLinks } = DOM_SELECTORS;

  // 3.1 导航高亮：根据当前页面URL匹配激活状态
  const currentUrl = window.location.href;
  navLinks.each(function() {
    const linkUrl = $(this).attr("href");
    if (currentUrl.includes(linkUrl)) {
      $(this).addClass("active");
    }
  });

  // 3.2 回到顶部按钮
  $(window).scroll(function() {
    // 滚动超过300px显示按钮，否则隐藏
    backToTop.fadeToggle($(this).scrollTop() > 300);
  });

  backToTop.click(function() {
    // 平滑滚动到顶部
    $("html, body").animate({ scrollTop: 0 }, 500);
  });
}

// ==============================================
// 4. 首页专属交互：轮播图初始化
// ==============================================
function initHomeSwiper() {
  // 仅在首页（存在轮播容器）时执行
  if ($(".banner .swiper").length > 0) {
    new Swiper('.banner .swiper', {
      autoplay: {
        delay: 3000, // 自动轮播间隔3秒
        disableOnInteraction: false // 交互后仍自动轮播
      },
      loop: true, // 无限循环
      pagination: {
        el: '.swiper-pagination',
        clickable: true // 分页点可点击
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      }
    });
  }
}

// ==============================================
// 5. AR教学页专属交互：弹窗控制
// ==============================================
function initARModal() {
  const { arBtn, arModal, arModalClose, arModalBtn } = DOM_SELECTORS;

  // 无AR弹窗元素时跳过
  if (!arModal.length) return;

  // 打开AR体验弹窗
  arBtn.click(function() {
    arModal.css("display", "flex");
    $("body").css("overflow", "hidden");
  });

  // 关闭弹窗（关闭按钮/确认按钮）
  function closeARModal() {
    arModal.css("display", "none");
    $("body").css("overflow", "auto");
  }

  arModalClose.click(closeARModal);
  arModalBtn.click(closeARModal);

  // 点击弹窗外部关闭
  $(window).click(function(e) {
    if (e.target === arModal[0]) {
      closeARModal();
    }
  });
}

// ==============================================
// 6. 作品广场页专属交互
// ==============================================
function initWorksPage() {
  const { 
    filterItems, worksItems, worksModal, worksModalClose,
    modalImg, modalTitle, modalAuthor, modalCraft, modalDesc, modalCraftDetail,
    pageItems, pagePrev, pageNext
  } = DOM_SELECTORS;

  // 无作品广场元素时跳过
  if (!worksItems.length) return;

  // 6.1 作品分类筛选
  filterItems.click(function() {
    // 切换筛选激活状态
    filterItems.removeClass("active");
    $(this).addClass("active");
    const filterCategory = $(this).data("filter");

    // 筛选作品：显示匹配分类/全部作品，隐藏其他
    worksItems.each(function() {
      const workCategory = $(this).data("category");
      const isMatch = filterCategory === "all" || filterCategory === workCategory;
      $(this).fadeToggle(isMatch, 300);
    });
  });

  // 6.2 作品详情弹窗
  worksItems.click(function() {
    // 获取作品卡片数据
    const $this = $(this);
    const imgSrc = $this.find(".works-img").attr("src");
    const title = $this.find(".works-title").text();
    const author = $this.find(".works-author").text();
    const craft = $this.find(".works-craft").text();
    const desc = $this.find(".works-desc").text();
    const category = $this.data("category");

    // 填充弹窗内容
    modalImg.attr({ src: imgSrc, alt: title });
    modalTitle.text(title);
    modalAuthor.html(`👤 ${author}`);
    modalCraft.html(`🧵 ${craft}`);
    modalDesc.text(desc);

    // 根据分类生成工艺细节
    const craftDetailMap = {
      生肖: "生肖香包以十二生肖为原型，采用庆阳传统平针、打籽针绣制，造型灵动，色彩以红、黄、绿为主，融合吉祥纹样，是庆阳香包最具代表性的品类之一。",
      福寿: "福寿香包融合牡丹、寿桃、蝙蝠、松鹤等吉祥纹样，采用锁针、辫针绣制，造型饱满，寓意富贵长寿，是庆阳民间祝寿、祈福的经典作品。",
      五毒: "五毒香包绣制蛇、蝎、蜈蚣、壁虎、蟾蜍五毒纹样，内置艾草、菖蒲等香料，采用立体刺绣工艺，是庆阳端午驱邪避瘟的传统民俗香包。",
      民俗: "民俗香包紧扣庆阳婚嫁、端午、春节等民俗场景，纹样贴合民俗寓意，绣工兼具粗犷与细腻，是庆阳民俗文化的活态载体。",
      布艺: "布艺香包以纯棉粗布为原料，采用纯手工拼接+刺绣工艺，造型立体，质感质朴，兼具装饰与实用价值，是庆阳传统布艺工艺的结晶。"
    };
    modalCraftDetail.text(craftDetailMap[category] || "庆阳香包非遗工艺，纯手工绣制，兼具文化与艺术价值。");

    // 显示弹窗并禁止背景滚动
    worksModal.css("display", "flex");
    $("body").css("overflow", "hidden");
  });

  // 关闭作品弹窗
  function closeWorksModal() {
    worksModal.css("display", "none");
    $("body").css("overflow", "auto");
  }

  worksModalClose.click(closeWorksModal);
  // 点击弹窗外部关闭
  $(window).click(function(e) {
    if (e.target === worksModal[0]) {
      closeWorksModal();
    }
  });

  // 6.3 分页交互
  pageItems.click(function() {
    // 切换分页激活状态
    pageItems.removeClass("active");
    $(this).addClass("active");
    
    // 重置上一页/下一页禁用状态
    pagePrev.removeClass("page-disabled");
    pageNext.removeClass("page-disabled");
    
    // 第一页禁用上一页，最后一页禁用下一页
    const currentPage = parseInt($(this).text());
    if (currentPage === 1) pagePrev.addClass("page-disabled");
    if (currentPage === 3) pageNext.addClass("page-disabled");
  });

  // 上一页
  pagePrev.click(function() {
    if ($(this).hasClass("page-disabled")) return;
    const currentPage = parseInt($(".page-item.active").text());
    if (currentPage > 1) {
      $(`.page-item:contains(${currentPage - 1})`).click();
    }
  });

  // 下一页
  pageNext.click(function() {
    if ($(this).hasClass("page-disabled")) return;
    const currentPage = parseInt($(".page-item.active").text());
    if (currentPage < 3) {
      $(`.page-item:contains(${currentPage + 1})`).click();
    }
  });
}

// ==============================================
// 7. 初始化所有交互（DOM加载完成后执行）
// ==============================================
$(function() {
  // 按执行顺序初始化各模块
  initMobileNav();       // 移动端导航（优先）
  initCommonInteraction();// 公共交互
  initHomeSwiper();      // 首页轮播
  initARModal();         // AR教学页弹窗
  initWorksPage();       // 作品广场页交互
});
