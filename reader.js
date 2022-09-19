const fs = require("fs");
let imglist = [];
fs.readdir("./src/assets", (err, files) => {
  if (err) {
    console.log(err);
  } else {
    // console.log(files); 返回的文件是个数组,可以用forEach循环输出文件名
    files.forEach((x) => {
      console.log("有" + x + "这个文件" + typeof x);
      if (
        x.indexOf(".png") == -1 &&
        x.indexOf(".zip") == -1 &&
        x.indexOf(".jpg") == -1
      ) {
        fs.readdir("./src/assets/" + x, (err1, files1) => {
          if (err1) {
            console.log(err1);
          } else {
            files1.forEach((y) => {
              console.log(y);
              if (
                y.indexOf(".png") == -1 &&
                y.indexOf(".zip") == -1 &&
                y.indexOf(".jpg") == -1
              ) {
                fs.readdir("./src/assets/" + x + "/" + y, (err2, files2) => {
                  if (err2) {
                    console.log(err2);
                  } else {
                    files2.forEach((z) => {
                      console.log(z);
                      if (
                        z.indexOf(".png") == -1 &&
                        z.indexOf(".zip") == -1 &&
                        z.indexOf(".jpg") == -1
                      ) {
                      } else {
                        imglist.push(
                          `"` + "./src/assets/" + x + "/" + y + "/" + z + `"`
                        );
                      }
                    });
                  }
                });
              } else {
                imglist.push(`"` + "./src/assets/" + x + "/" + y + `"`);
              }
            });
          }
        });
      } else {
        imglist.push(`"` + "./src/assets/" + x + `"`);
      }
    });
  }
});
setTimeout(() => {
  fs.writeFile("./path.txt", imglist.join(","), (err, file) => {});
}, 5000);
