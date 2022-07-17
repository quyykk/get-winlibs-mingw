# get-winlibs-mingw

A Github Action to download and cache a specific version of MinGW from [WinLibs](https://winlibs.com/). It downloads the MSVCRT version. Visit the site to learn which versions are available (or check the source).

## Quickstart

```yml
    - name: Get MinGW
	  uses: quyykk@get-winlibs-mingw@v1
	  with:
	    version: 11.3.0 # Default is 12.1.0
		arch: x64 # or x86
```
