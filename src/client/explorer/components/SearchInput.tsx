import { grey } from '@material-ui/core/colors';
import { createStyles, IconButton, InputBase, Theme, WithStyles } from '@material-ui/core';
import { Search as SearchIcon } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import React, { ChangeEvent, KeyboardEvent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import actions from '../reducers/actions';
import { State } from '../reducers/store';

const styles = (theme: Theme) =>
  createStyles({
    inputContainer: {
      display: 'flex',
      border: `1px solid ${grey[300]}`,
      borderRadius: theme.typography.pxToRem(16),
    },
    textInput: {
      flexGrow: 1,
      paddingLeft: theme.spacing.unit * 2,
    },
    searchIconButton: {
      padding: theme.spacing.unit,
    },
  });

interface Props extends WithStyles<typeof styles> {
  input: QueryInput;
  setInputText: (text: string) => void;
}

const mapStateToProps = (state: State) => ({
  input: state.explorer.input,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actions, dispatch);

// tslint:disable-next-line: variable-name
const SearchInput = (props: Props): JSX.Element => {
  const { classes, input, setInputText } = props;

  const inputFormRef = React.createRef<HTMLFormElement>();

  const onInputTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputText(e.currentTarget.value);
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
)(withStyles(styles, { withTheme: true })(SearchInput));
