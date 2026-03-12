$(document).ready(() => {

  // Variables
  const $codeSnippets = $(".code-example-body");
  const $nav = $(".navbar");
  const $body = $("body");
  const $window = $(window);
  const $popoverLinks = $("[data-popover]");
  let navOffsetTop = $nav.offset().top;
  const $document = $(document);
  const entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
    "/": "&#x2F;",
  };

  // Debounce Function
  const debounce = (func, wait = 100) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  // Initialize Event Listeners
  const init = () => {
    $window.on("scroll", debounce(onScroll, 100));
    $window.on("resize", debounce(resize, 100));
    $popoverLinks.on("click", openPopover);
    $document.on("click", closePopover);
    $("a[href^='#']").on("click", smoothScroll);
    buildSnippets();
  };

  // Smooth Scroll Handler
  const smoothScroll = function (e) {
    e.preventDefault();
    $document.off("scroll");
    const target = this.hash;
    const $target = $(target);
    $("html, body")
      .stop()
      .animate(
        {
          scrollTop: $target.offset().top - 40,
        },
        500,
        "swing",
        () => {
        window.location.hash = target;
      $document.on("scroll", onScroll);
        }
      );
  };

  // Open Popover Handler
  const openPopover = function (e) {
    e.preventDefault();
    closePopover();
    const popoverSelector = $(this).data("popover");
    const $popover = $(popoverSelector);
    if ($popover.length) {
      $popover.toggleClass("open");
      if ($popover.hasClass("open")) {
        $popover.attr("tabindex", "-1").focus();
      }
    e.stopImmediatePropagation();
    } else {
      console.warn(`Popover element not found for selector: ${popoverSelector}`);
    }
  };

  // Close Popover Handler
  const closePopover = (e) => {
    if ($(".popover.open").length > 0) {
      $(".popover").removeClass("open");
    }
  };

  // Scroll Handler
  const onScroll = () => {
    const scrollTop = $window.scrollTop();
    if (navOffsetTop < scrollTop && !$body.hasClass("has-docked-nav")) {
      $body.addClass("has-docked-nav");
    } else if (navOffsetTop > scrollTop && $body.hasClass("has-docked-nav")) {
      $body.removeClass("has-docked-nav");
    }
  };

  // Resize Handler
  const resize = () => {
    $body.removeClass("has-docked-nav");
    navOffsetTop = $nav.offset().top;
    onScroll();
  };

  // Escape HTML Characters
  const escapeHtml = (string) =>
    String(string).replace(/[&<>"'/]/g, (s) => entityMap[s]);

  // Build Code Snippets
  const buildSnippets = () => {
    $codeSnippets.each(function () {
      const content = $(this).html();
      if (!$(this).hasClass("escaped")) {
        $(this).html(escapeHtml(content)).addClass("escaped");
      }
    });
  };

  // Toggle Abstract Content Visibility
  $(".toggle-abstract").on("click", function () {
    const $button = $(this);
    const abstractId = $button.attr("aria-controls");
    const $abstractContent = $("#" + abstractId);
    const isHidden = $abstractContent.is(":hidden");

    // Close other abstracts
    $(".abstract-content").not($abstractContent).removeClass("show").hide();
    $(".toggle-abstract").not($button).text("Show Abstract").attr("aria-expanded", false);

    // Toggle the current abstract
    $abstractContent.toggleClass("show").toggle();
    $button.text(isHidden ? "Hide Abstract" : "Show Abstract");
    $button.attr("aria-expanded", isHidden);
  });

  // Smooth Scroll Button Handler
  $("#button").on("click", () => {
    $("html, body").animate(
      {
        scrollTop: $("#elementtoScrollToID").offset().top,
      },
      2000
    );
});

  // Initialize All
  init();
});