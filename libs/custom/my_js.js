$(document).ready(() => {
  const $window = $(window);
  const $nav = $(".site-nav");
  const $links = $(".site-nav-link[data-section-link]");
  const $sections = $("[data-section]");
  const setAbstractLabel = ($button, isOpen) => {
    $button.text(isOpen ? "Hide abstract" : "Show abstract");
  };

  const updateActiveSection = () => {
    if (!$links.length || !$sections.length) {
      return;
    }

    const navHeight = $nav.outerHeight() || 0;
    const scrollPosition = $window.scrollTop() + navHeight + 100;
    let activeId = $sections.first().attr("id");

    $sections.each(function () {
      const $section = $(this);
      if (scrollPosition >= $section.offset().top) {
        activeId = $section.attr("id");
      }
    });

    $links.each(function () {
      const isActive = this.hash === `#${activeId}`;
      $(this).toggleClass("active", isActive);
      if (isActive) {
        $(this).attr("aria-current", "location");
      } else {
        $(this).removeAttr("aria-current");
      }
    });
  };

  const smoothScroll = function (event) {
    const hash = this.hash;
    if (!hash) {
      return;
    }

    const $target = $(hash);
    if (!$target.length) {
      return;
    }

    event.preventDefault();
    const navOffset = ($nav.outerHeight() || 0) + 16;

    $("html, body").stop().animate(
      { scrollTop: Math.max($target.offset().top - navOffset, 0) },
      320,
      "swing",
      () => {
        if (window.history && window.history.pushState) {
          window.history.pushState(null, "", hash);
        } else {
          window.location.hash = hash;
        }
        updateActiveSection();
      }
    );
  };

  const closeAbstract = ($button) => {
    const panelId = $button.attr("aria-controls");
    const $panel = $("#" + panelId);
    $button.attr("aria-expanded", "false");
    setAbstractLabel($button, false);
    $panel.stop(true, true).slideUp(180).attr("aria-hidden", "true");
  };

  const openAbstract = ($button) => {
    const panelId = $button.attr("aria-controls");
    const $panel = $("#" + panelId);
    $button.attr("aria-expanded", "true");
    setAbstractLabel($button, true);
    $panel.stop(true, true).slideDown(180).attr("aria-hidden", "false");
  };

  $links.on("click", smoothScroll);

  $(document).on("click", ".toggle-abstract", function () {
    const $button = $(this);
    const isOpen = $button.attr("aria-expanded") === "true";

    $(".toggle-abstract").not($button).each(function () {
      closeAbstract($(this));
    });

    if (isOpen) {
      closeAbstract($button);
    } else {
      openAbstract($button);
    }
  });

  $(".toggle-abstract").each(function () {
    setAbstractLabel($(this), false);
  });

  $(".abstract-panel").hide().attr("aria-hidden", "true");

  $window.on("scroll resize", updateActiveSection);
  updateActiveSection();
});
