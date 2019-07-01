"use strict";

function _instanceof(left, right) {
  if (
    right != null &&
    typeof Symbol !== "undefined" &&
    right[Symbol.hasInstance]
  ) {
    return right[Symbol.hasInstance](left);
  } else {
    return left instanceof right;
  }
}

function _classCallCheck(instance, Constructor) {
  if (!_instanceof(instance, Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

var LazyImageLoader =
  /*#__PURE__*/
  (function() {
    function LazyImageLoader() {
      _classCallCheck(this, LazyImageLoader);

      this.images = document.querySelectorAll("[data-src]");
      this.imageCount = this.images.length;
      this.config = {
        rootMargin: "50px 0px",
        threshold: 0.01
      };
      this.main();
    }

    _createClass(LazyImageLoader, [
      {
        key: "main",
        value: function main() {
          var _this = this;

          // if intersection observer doesn't exist just load the image
          if (typeof window["IntersectionObserver"] === "undefined") {
            this.loadImagesImmediately(_this.images);
          } else {
            // create the observer
            this.observer = new IntersectionObserver(
              this.onIntersection.bind(this),
              this.config
            );
            this.images.forEach(function(image) {
              if (!image.classList.contains("js-lazy-image--handled")) {
                _this.observer.observe(image);
              }
            });
          }
        }
      },
      {
        key: "fetchImage",
        value: function fetchImage(url) {
          return new Promise(function(resolve, reject) {
            var image = new Image();
            image.src = url;
            image.onload = resolve;
            image.onerror = reject;
          });
        }
      },
      {
        key: "preloadImage",
        value: function preloadImage(image) {
          var _this2 = this;

          if (image !== "0") {
            var src = image.getAttribute("data-src");
          }

          if (!src) {
            return;
          }

          return this.fetchImage(src).then(function() {
            _this2.applyImage(image, src);
          });
        }
      },
      {
        key: "loadImagesImmediately",
        value: function loadImagesImmediately(images) {
          for (var i = 0; i < this.imageCount; i++) {
            this.preloadImage(images[i]);
          }
        }
      },
      {
        key: "onIntersection",
        value: function onIntersection(entries) {
          var _this3 = this;

          if (this.imageCount === 0) {
            this.observer.disconnect();
          }

          entries.forEach(function(entry) {
            if (entry.intersectionRatio > 0) {
              _this3.imageCount--;

              _this3.observer.unobserve(entry.target);

              _this3.preloadImage(entry.target);
            }
          });
        }
      },
      {
        key: "createSVG",
        value: function createSVG(img, src) {
          var imgID = img.getAttribute("id");
          var imgClass = img.getAttribute("class");
          var requestSVG = new XMLHttpRequest();
          requestSVG.open("GET", src, true);
          requestSVG.send();

          requestSVG.onload = function(e) {
            if (requestSVG.status >= 200 && requestSVG.status < 400) {
              // Success!
              var svg = requestSVG.responseXML.querySelector("svg");
              svg.getAttribute("xmlns:a") && svg.removeAttr("xmlns:a");

              if (imgID) {
                svg.setAttribute("id", imgID);
              }

              if (imgClass) {
                svg.setAttribute("class", imgClass + " replaced-svg");
              }

              img.replaceWith(svg);
            }
          };
        }
      },
      {
        key: "applyImage",
        value: function applyImage(img, src) {
          img.classList.add("js-lazy-image--handled");

          if (img.tagName === "IMG") {
            if (img.classList.contains("svg")) {
              this.createSVG(img, src);
            } else {
              img.src = src;
            }
          } else {
            img.style.backgroundImage = "url('".concat(src, "')");
          }

          console.log("applied image", src);
          document.body.classList.add("lazy-loaded");
        }
      }
    ]);

    return LazyImageLoader;
  })();

var lazyImageLoader = new LazyImageLoader();
