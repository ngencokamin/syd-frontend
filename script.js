axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
axios.defaults.baseURL = "https://syd-kilroy-api.herokuapp.com/";


// httpVueLoader.httpRequest = function(url) {
    
//   return axios.get(url)
//   .then(function(res) {
      
//       return res.data;
//   })
//   .catch(function(err) {
      
//       return Promise.reject(err.status);
//   });
// }

const vueApp = new Vue({
  el: "#main",
  mixins: [Vue2Filters.mixin],
  data: {
    display: "redbox",
    textLoaded: false,
    resumeLoaded: false,
    photos: [],
    resume: [],
    text: {},
  },
  components: {
    'tabs': httpVueLoader('./components/tabs.vue'),
    'tab': httpVueLoader('./components/tab.vue')
    // 'tab': Vue.defineAsyncComponent( () => loadModule('./components/tab.vue'), options )
  },
  // template: '<tabs>hi</tabs>',
  created: function () {
    this.indexPhotos();
  },
  onload: function () {},
  methods: {
    indexPhotos: function () {
      axios.get("/api/photos").then((response) => {
        console.log("photos index", response);
        this.photos = response.data;
        this.getText();
      });
    },

    getText: function () {
      axios.get("/api/text").then((response) => {
        let textArr = response.data;
        textArr.forEach((element) => {
          this.text[element.name] = element.body;
        });
        this.getResume();

        main.initViewer();
        this.fixSlide();
      });
    },

    getResume: function () {
      axios.get("/api/resume").then((response) => {
        this.resume = response.data;
        this.resume.forEach((entry) => {
          var endDate = (entry.dates.includes(" - ") ? entry.dates.split(" - ")[1] : entry.dates.split("-")[1]).toLowerCase();
          if (endDate == "present") {
            entry.index = 3000
          } else if(endDate.includes(' ')) {
            var endDateArr = endDate.split(" ");
            let seasonIndex = 0.0;
            switch (endDateArr[0]) {
              case "spring":
                seasonIndex = 0.25;
                break;
              case "summer":
                seasonIndex = 0.5;
                break;
              case "fall":
                seasonIndex = 0.75;
                break;
              case "winter":
                seasonIndex = 1.0;
                break;
            }
            entry.index = parseFloat(endDateArr[1]) + seasonIndex;
          }
          else {
            entry.index = parseInt(endDate);
          }
        });
      });
    },

    fixSlide: function () {
      let firstPhoto = this.photos.find((photo) => photo.index === 1);
      var oldSlide = main.current !== null ? main.slides[main.current] : null,
        newSlide = main.slides[1];
      oldSlide.$parent.removeClass("active");
      oldSlide.$slide.removeClass("active");
      newSlide.$parent.addClass("active").focus();
      newSlide.$slide.appendTo(main.$viewer);
      newSlide.loaded = true;
      newSlide.$slide.addClass("active");
      newSlide.$slideImage.css(
        "background-image",
        "url(" + firstPhoto.image_url + ")"
      );
      main.current = 1
    },
  },
});
