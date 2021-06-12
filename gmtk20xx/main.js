requirejs.config({
    baseUrl: 'lib',
    paths: {
        'app': '../app'
    }
});

requirejs(['app'], function(GMTK2021) {
    console.log('Starting application...');

    var app = new GMTK2021.App();
    app.start();
});
