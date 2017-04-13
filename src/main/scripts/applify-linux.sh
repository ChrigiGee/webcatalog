#!/usr/bin/env bash

# applify-linux.sh "App name" "URL" "Icon path" "Id"

APPNAME=${1}
APPURL=${2}
APPICON=${3}
APPID=${4}
JSONCONTENT=${5}
ICONDIR=$(eval echo "~/.icons/webcatalog")

BINDIR=$(eval echo "~/.local/share/webcatalog")
BINFILE="${BINDIR}/${APPID}"

APPDIR=$(eval echo "~/.local/share/applications/webcatalog")
DESKTOPFILE="${APPDIR}/${APPID}.desktop"

echo $DESKTOP_FILE

mkdir -p "${BINDIR}"

mkdir -p "${APPDIR}"

mkdir -p "${ICONDIR}"

cat <<EOF > "${BINFILE}"
#!/usr/bin/env bash
/opt/WebCatalog/webcatalog --name="$APPNAME" --url="$APPURL" --id="$APPID"
EOF
chmod +x "${BINFILE}"

cp -v "$APPICON" "${ICONDIR}/${APPID}.png"

cat <<EOF > "${DESKTOPFILE}"
[Desktop Entry]
#${JSONCONTENT}
Name=$APPNAME
Exec=$BINFILE
Icon=$ICONDIR/$APPID.png
Type=Application
EOF
