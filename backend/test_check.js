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
    console.log('Missing test files for: ', missingTestFiles);
    console.log("- Please create test files for the above files and run 'npm run test' again.")
    console.log("- If a test file is not needed, please describe why it is not needed as a comment in the file.")
    process.exit(1);
}