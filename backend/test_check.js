//this file ensures that all files in the src folder have a corresponding test file in the test folder
//this file is run as a pretest script in package.json
const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, './src');
const testPath = path.join(__dirname, './test');

//loop thourgh all files in src folder recursively
const srcFiles = [];
const testFiles = [];

const walkSync = (dir, filelist = []) => {
    // Read all files and directories in the current directory
    const files = fs.readdirSync(dir);

    // Iterate through each file/directory
    files.forEach(file => {
        const filePath = path.join(dir, file);
        
        // Check if it is a directory
        if (fs.statSync(filePath).isDirectory()) {
            // If it is a directory, recursively call walkSync
            filelist = walkSync(filePath, filelist);
        } else {
        // If it is a file, add it to the filelist
            filelist.push(filePath);
        }
    });

    return filelist;
};

walkSync(srcPath, srcFiles);
walkSync(testPath, testFiles);

var srcFileNames = srcFiles.map((file) => {
    var f = file.split('.')[0];
    //only get get the part after /src/
    f = f.split('/src/')[1];
    //ignore all files and directores with ___ in the name

    //only include js, ts, and jsx files
    if (!f.includes('.js') && !f.includes('.ts') && !f.includes('.jsx')) {
        return undefined;
    }

    if (!f.includes('___')) {
        return f;
    }
});

//remove undefined values from srcFileNames
srcFileNames = srcFileNames.filter((file) => {
    return file != undefined;
});

const testFileNames = testFiles.map((file) => {
    var f = file.split('.')[0];
    f = f.split('/test/')[1];
    return f;
});

const missingTestFiles = srcFileNames.filter((file) => {
    return !testFileNames.includes(file);
});

if (missingTestFiles.length > 0) {
    process.exit(1);
}