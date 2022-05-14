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
          light: 'solid 2px #ddddff',
          sizer: 'solid 4px #dddddd',
        },
        shadow: {
          text: '1 1 1 #3333ff',
        },
        background: {
          main: '#eeeeee',
          verse: '#ddddff',
          light: '#ccccee',
          active: '#99d5cc',
          selected: '#ddddff',
          hover: '#cccccc',
          highlighted: '#99ffff',
        },
      },
    };
  }

  return {
    palette: {
      mode,
      text: {
        main: '#ffffff',
        active: '#ff9966',
        tag: '#dd99dd',
        header: '#ffddee',
        strongs: {
          main: '#7f7fff',
          hover: '#7fffff',
        },
        link: {
          main: '#6666ff',
          hover: '#ffff33',
        },
        transcription: '#ff6666',
      },
      border: {
        tab: 'solid 1px #7f7f7f',
        highlighted: 'solid 2px #663b44',
        light: 'solid 2px #444411',
        sizer: 'solid 4px #444444',
      },
      shadow: {
        text: '1 1 1 #3333ff',
      },
      background: {
        main: '#111111',
        verse: '#221707',
        light: '#554411',
        active: '#663b44',
        selected: '#665511',
        hover: '#444444',
        highlighted: '#112700',
      },
    },
  };
}