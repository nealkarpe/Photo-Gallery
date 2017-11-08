var makePhoto = function (photoData) {
    var data = {
        private: photoData.private,
        file: photoData.file,
    };

    console.log(typeof(data.file));
    var getData = function () {
        return data;
    };
    var t = {};
    t.getData = getData;
    return t;
};
