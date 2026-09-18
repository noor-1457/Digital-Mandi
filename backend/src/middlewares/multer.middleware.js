import multer from "multer";

// Set up multer storage configuration
const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        // Multer uploaded file ko temporary folder mein save karega
        cb(null, "./public/temp");
    },

    filename: function (req, file, cb) {

        // Unique filename generate hoga
        const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1E9);

        cb(
            null,
            file.fieldname + "-" + uniqueSuffix
        );
    },

});

const upload = multer({
    storage: storage
});

export default upload;