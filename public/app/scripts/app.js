(function(document) {
    'use strict';

    var app = document.querySelector('#app');

    app.baseUrl = '/';
    if (window.location.port === '') { // if production
        // Uncomment app.baseURL below and
        // set app.baseURL to '/your-pathname/' if running from folder in production
        app.baseUrl = '/home/ankit/J.A.R.V.I.S/version3/app/';
    }


    // Checking if local storage is available on browser
    if (typeof(Storage) !== "undefined") {
        // Code for localStorage/sessionStorage.
        var student_data = JSON.parse(localStorage.getItem('student_data')); // gives back string object

        //checking if the token has login credentials or not
        if (student_data.student.student_loginID === "" || null) {

            return (window.location.assign("/app/index.html"));
        }

        app.username = student_data.student.student_email;

        app.expandFunction = function() {

            if (!app.showProfileMenu) {
                app.$.profileMenu.open();
                app.showProfileMenu = true;
                app.$.openBox.style.display = "none";
                app.$.closeBox.style.display = "block";
            } else {
                app.$.profileMenu.close();
                app.showProfileMenu = false;
                app.$.closeBox.style.display = "none";
                app.$.openBox.style.display = "block";
            }

        };
        app.dialogClosed = function() {
            app.$.profileMenu.close();
            app.showProfileMenu = false;
            app.$.closeBox.style.display = "none";
            app.$.openBox.style.display = "block";
        };

        app.logoutFunction = function() {
            localStorage.student_data = "";
            //window.location.assign("index.html");
        };


        // See https://github.com/Polymer/polymer/issues/1381
        window.addEventListener('WebComponentsReady', function() {
            // imports are loaded and elements have been registered
            app.listen(app.$.profileMenu, 'iron-overlay-closed', 'dialogClosed');
        });




    } else {


        // Sorry! No Web Storage support..
        window.location.assign("/app/index.html");
    }


})(document);

// // if loginid is not valid go to login page
// if (typeof localStorage.loginid == undefined && localStorage.loginid == null && localStorage.loginid == "") {
//     window.location.assign("/app/index.html");
// } else {
//     app.username = localStorage.username;
//     app.userimage = localStorage.userimage;
//     app.showProfileMenu = false;
// }



// app.displayInstalledToast = function() {
//     // Check to make sure caching is actually enabled—it won't be in the dev environment.
//     if (!Polymer.dom(document).querySelector('platinum-sw-cache').disabled) {
//         Polymer.dom(document).querySelector('#caching-complete').show();
//     }
// };

// // Listen for template bound event to know when bindings
// // have resolved and content has been stamped to the page
// app.addEventListener('dom-change', function() {
//     // var loadingScreen = document.querySelector('#loading');
//     // loadingScreen.style.display='none';
// });





// // Scroll page to top and expand header
// app.scrollPageToTop = function() {

// };

// app.closeDrawer = function() {
//     app.$.paperDrawerPanel.closeDrawer();
// };

// app._refreshFunction = function() {
//     location.reload();
// };



// app.openFeedback = function() {
//     app.$.feedbackForm.setUsername();
//     app.$.emailstudysolo.open();
// };
// app.scrollToHeader = function() {
//     document.getElementById('mainCo').scrollIntoView(true);
// };
