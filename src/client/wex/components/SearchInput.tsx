import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import { grey } from '@material-ui/core/colors';
import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import SearchIcon from '@material-ui/icons/Search';
import React, { ChangeEvent, KeyboardEvent, useRef } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { setInputText } from '../reducers/actions';
import { State } from '../reducers/store';

const useStyles = makeStyles((theme: Theme) => ({
  inputContainer: {
    display: 'flex',
    border: `1px solid ${grey[300]}`,
    borderRadius: theme.typography.pxToRem(16),
  },
  textInput: {
    flexGrow: 1,
    paddingLeft: theme.spacing(2),
  },
  searchIconButton: {
    padding: theme.spacing(1),
  },
}));

interface Props {
  input: QueryInput;
  setInputText: typeof setInputText;
}

const mapStateToProps = (state: State) => ({
  input: state.explorer.input,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({ setInputText }, dispatch);

// tslint:disable-next-line: variable-name
const SearchInput = (props: Props): JSX.Element => {
  const { input } = props;

  const classes = useStyles();

  const inputFormRef = useRef<HTMLFormElement>(null);

  const onInputTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    props.setInputText(e.currentTarget.value);
  };

  const onInputKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      const elem = inputFormRef.current;
      if (elem) {
        elem.submit();
      }
    }
  };

  return (
    <form ref={inputFormRef}>
      <div className={classes.inputContainer}>
        <InputBase
          className={classes.textInput}
          margin="none"
          name="q"
          value={input.text}
          onChange={onInputTextChange}
          onKeyPress={onInputKeyPress}
        />
        <IconButton
          className={classes.searchIconButton}
          type="submit"
          aria-label="Search"
          color={!input.text ? 'default' : 'primary'}
        >
          <SearchIcon />
        </IconButton>
      </div>
    </form>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchInput);
