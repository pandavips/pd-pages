((doc, win) => {
  // 远程获取npm某个包的最新版本信息
  win.getNpmPackageData = async (packageName) => {
    const url = `https://registry.npmjs.org/${packageName}/latest`;
    const res = await fetch(url);
    const data = await res.json();
    return data;
  };

  // 远程获取npm某个包的最新版本号
  win.getNpmPackageVersion = async (packageName) => {
    const data = await getNpmPackageData(packageName);
    return data.version;
  };

})(document, window)

