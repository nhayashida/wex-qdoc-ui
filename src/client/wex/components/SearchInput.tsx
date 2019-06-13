import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import { grey } from '@material-ui/core/colors';
import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import SearchIcon from '@material-ui/icons/Search';
import React, { ChangeEvent, KeyboardEvent, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { State } from '../reducers/store';
import { setQueryInput } from '../reducers/wex/actions';

const useStyles = makeStyles((theme: Theme) => ({
  inputContainer: {
    display: 'flex',
    border: `1px solid ${grey[300]}`,
    borderRadius: theme.typography.pxToRem(16),
    '& > div': {
      flexGrow: 1,
      paddingLeft: theme.spacing(2),
    },
    '& > button': {
      padding: theme.spacing(1),
    },
  },
}));

// tslint:disable-next-line: variable-name
const SearchInput = (): JSX.Element => {
  const dispatch = useDispatch();
  const input = useSelector((state: State) => state.wex.input);

  const classes = useStyles();

  const formRef = useRef<HTMLFormElement>(null);

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setQueryInput(e.currentTarget.value));
  };

  const onInputKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      const elem = formRef.current;
      if (elem) {
        elem.submit();
      }
    }
  };

  return (
    <form ref={formRef}>
      <div className={classes.inputContainer}>
        <InputBase
          margin="none"
          name="q"
          value={input}
          onChange={onInputChange}
          onKeyPress={onInputKeyPress}
        />
        <IconButton type="submit" aria-label="Search" color={!input ? 'default' : 'primary'}>
          <SearchIcon />
        </IconButton>
      </div>
    </form>
  );
};

export default SearchInput;
