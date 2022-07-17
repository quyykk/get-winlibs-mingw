const core = require('@actions/core');
const tc = require('@actions/tool-cache');
const path = require('path')

const urlPrefix = "https://github.com/brechtsanders/winlibs_mingw/releases/download/"


// Returns the URL to the WinLibs MinGW zip with the given properties.
function getWinlibsURL(version, arch) {
    // Due to the URLs not following a set template,
    // we unfortunately need to hardcode the URLs.
    if (version == "7.5.0") {
        return arch == "x64" ? "7.5.0-7.0.0-r1/winlibs-x86_64-posix-seh-gcc-7.5.0-mingw-w64-7.0.0-r1.7z" :
            "7.5.0-7.0.0-r1/winlibs-i686-posix-dwarf-gcc-7.5.0-mingw-w64-7.0.0-r1.7z"
    } else if (version == "8.5.0") {
        return arch == "x64" ? "8.5.0-9.0.0-r1/winlibs-x86_64-posix-seh-gcc-8.5.0-mingw-w64-9.0.0-r1.7z" :
            "8.5.0-9.0.0-r1/winlibs-i686-posix-dwarf-gcc-8.5.0-mingw-w64-9.0.0-r1.7z";
    } else if (version == "9.4.0") {
        return arch == "x64" ?
            "9.4.0-9.0.0-msvcrt-r2/winlibs-x86_64-posix-seh-gcc-9.4.0-mingw-w64-9.0.0-r2.7z" :
            "9.4.0-9.0.0-msvcrt-r2/winlibs-i686-posix-dwarf-gcc-9.4.0-mingw-w64-9.0.0-r2.7z";
    } else if (version == "10.3.0") {
        return arch == "x64" ?
            "10.3.0-12.0.0-9.0.0-r2/winlibs-x86_64-posix-seh-gcc-10.3.0-mingw-w64-9.0.0-r2.7z" :
            "10.3.0-12.0.0-9.0.0-r2/winlibs-i686-posix-dwarf-gcc-10.3.0-mingw-w64-9.0.0-r2.7z";
    } else if (version == "11.2.0") {
        return arch == "x64" ?
            "11.2.0-14.0.0-9.0.0-msvcrt-r7/winlibs-x86_64-posix-seh-gcc-11.2.0-mingw-w64msvcrt-9.0.0-r7.7z" :
            "11.2.0-14.0.0-9.0.0-msvcrt-r7/winlibs-i686-posix-dwarf-gcc-11.2.0-mingw-w64msvcrt-9.0.0-r7.7z";
    } else if (version == "11.3.0") {
        return arch == "x64" ?
            "11.3.0-14.0.3-10.0.0-msvcrt-r3/winlibs-x86_64-posix-seh-gcc-11.3.0-mingw-w64msvcrt-10.0.0-r3.7z" :
            "11.3.0-14.0.3-10.0.0-msvcrt-r3/winlibs-i686-posix-dwarf-gcc-11.3.0-mingw-w64msvcrt-10.0.0-r3.7z";
    } else if (version == "12.1.0") {
        return arch == "x64" ?
            "12.1.0-14.0.4-10.0.0-msvcrt-r2/winlibs-x86_64-posix-seh-gcc-12.1.0-mingw-w64msvcrt-10.0.0-r2.zip" :
            "12.1.0-14.0.4-10.0.0-msvcrt-r2/winlibs-i686-posix-dwarf-gcc-12.1.0-mingw-w64msvcrt-10.0.0-r2.7z";
    }
    return "";
}

async function run() {
    try {
        const version = core.getInput('version');
        if (version != "7.5.0" && version != "8.5.0" && version != "9.4.0" && version != "10.3.0" &&
            version != "11.2.0" && version != "11.3.0" && version != "12.1.0") {
            core.setFailed(`Invalid version '${version}'`);
            return;
        }
        const arch = core.getInput('arch');
        if (arch != "x64" && arch != "x86") {
            core.setFailed(`Invalid arch value '${arch}'`);
            return;
        }

        let mingwDir = tc.find('mingw', version, arch);
        if (!mingwDir) {
            core.info(`Fetching MinGW ${version}-${arch}`);

            const mingwPath = await tc.downloadTool(urlPrefix + getWinlibsURL(version, arch));
            core.info(`Extracing archive`);
            const mingwFolder = await tc.extractZip(mingwPath, path.join(process.env.RUNNER_TEMP,
                "mingw-winlibs"));

            core.info(`Saving cache`);
            mingwDir = await tc.cacheDir(mingwFolder, 'mingw', version, arch);
        } else {
            core.info(`Restoring MinGW ${version}-${arch} from cache`)
        }
        core.addPath(mingwDir);
        core.info(`Done`);
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
