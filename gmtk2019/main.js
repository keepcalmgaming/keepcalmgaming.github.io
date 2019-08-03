requirejs.config({
    baseUrl: 'lib',
    paths: {
        'app': '../app'
    }
});

requirejs(['app'], function(GMTK2019) {
    console.log('Starting application...');

    var app = new GMTK2019.App();
    app.start();
});
