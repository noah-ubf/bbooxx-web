export const getTheme = (mode) => {
  if (mode === 'light') {
    return {
      palette: {
        mode,
        text: {
          main: '#000000',
          active: '#339999',
          tag: '#006633',
          header: '#003311',
          strongs: {
            main: '#7f7fff',
            hover: '#00007f',
          },
          link: {
            main: '#6666ff',
            hover: '#0000dd',
          },
          transcription: '#ff6666',
        },
        border: {
          tab: 'solid 1px #7f7f7f',
          highlighted: 'solid 2px #99d5cc',
          light: 'solid 4px #ddddff',
          active: 'solid 4px #99d5cc',
          sizer: 'solid 4px #dddddd',
        },
        shadow: {
          text: '1 1 1 #3333ff',
        },
        background: {
          main: '#eeeeee',
          verse: '#ddddff',
          veryLight: '#e7e7ff',
          light: '#ccccee',
          active: '#99d5cc',
          selected: '#ddddff',
          hover: '#cccccc',
          highlighted: '#99ffff',
          transparent: 'rgba(255,255,255,0)',
        },
        inversion: {
        }
      },
    };
  }

  return {
    palette: {
      mode,
      text: {
        main: '#c1b09e',
        active: '#0b5a45',
        tag: '#9999dd',
        header: '#337733',
        strongs: {
          main: '#7f7fcc',
          hover: '#7fffff',
        },
        link: {
          main: '#6666ff',
          hover: '#ffff33',
        },
        transcription: '#d76666',
      },
      border: {
        tab: 'solid 1px #333333',
        highlighted: 'solid 2px #333733',
        light: 'solid 4px #222211',
        active: 'solid 4px #662a33',
        sizer: 'solid 4px #334433',
      },
      shadow: {
        text: '1 1 1 #3333ff',
      },
      background: {
        main: '#111111',
        verse: '#211e25',
        veryLight: '#1c1c1c',
        light: '#001e1c',
        active: '#663333',
        selected: '#665511',
        hover: '#444444',
        highlighted: '#112700',
        transparent: 'rgba(0,0,0,0)',
      },
      inversion: {
        filter: 'invert(.9)',
      }
    },
  };
}