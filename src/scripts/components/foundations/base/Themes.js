/* @flow */

import Colors from 'components/foundations/base/Colors'

const Themes = {
  dark: {
    body: {
      background: Colors.grayDark,
      color: Colors.grayLight
    },
    header: {
      background: Colors.black,
      iconsFill: Colors.grayLight,
      logoFill: Colors.white
    },
    footer: {
      background: Colors.black,
      color: Colors.white,
      logoFill: Colors.white
    },
    button: {
      white: Colors.white,
      gray: Colors.grayLight,
      purple: Colors.purple
    },
    popover: {
      border: Colors.gray,
      background: Colors.blackTransparent,
      color: Colors.white
    },
    TextField: {
      border: Colors.grayLight,
      borderFocus: Colors.purple,
      color: Colors.white,
      placeholder: Colors.grayLight,
      error: Colors.pink
    },
    Radio: {
      title: Colors.grayLight,
      label: Colors.white,
      border: Colors.grayLight,
      active: Colors.purple
    },
    MainCard: {
      background: Colors.black,
      color: Colors.white,
      title: Colors.white,
      subtitle: Colors.white,
      subtitleIcon: Colors.purple,
      footer: {
        background: Colors.blackDark,
        color: Colors.grayLight
      }
    },
    FilesUploader: {
      drag: {
        background: Colors.black,
        color: Colors.purple,
        color2: Colors.grayLight,
        info: Colors.purple,
        enter: Colors.blackTransparent
      },
      input: {
        background: Colors.blackDark,
        color: Colors.purple
      }
    },
    VideoList: {
      background: Colors.blackLight,
      title: Colors.purple,
      filename: Colors.white,
      status: Colors.grayLight,
      done: Colors.purple
    },
    VideoForm: {
      header: {
        border: Colors.grayMedium,
        title: Colors.white,
        subtitle: Colors.grayLight,
        subtitle2: Colors.purple
      },
      info: {
        time: {
          background: Colors.black,
          color: Colors.white
        },
        progress: {
          color: Colors.purple,
          icon: Colors.black,
          iconBg: Colors.purple,
          background: Colors.grayLight,
          barFrom: Colors.purpleGradientFrom,
          barTo: Colors.purpleGradientTo
        }
      }
    }
  }
}

export default Themes
