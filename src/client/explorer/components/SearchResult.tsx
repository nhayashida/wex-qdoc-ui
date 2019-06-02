import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Fab from '@material-ui/core/Fab';
import Typography from '@material-ui/core/Typography';
import { grey } from '@material-ui/core/colors';
import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { query } from '../reducers/actions';
import { Settings } from '../reducers/app/types';
import { State } from '../reducers/store';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    marginTop: theme.spacing(2),
  },
  resultCard: {
    boxShadow: '0 1px 6px rgba(32, 33, 36, 0.28)',
    borderRadius: theme.typography.pxToRem(8),
    backgroundColor: 'transparent',
    marginBottom: theme.spacing(1.5),
    '& > div': {
      '&:last-child': {
        paddingBottom: theme.spacing(2),
      },
      '& > p': {
        '&:first-child': {
          fontSize: theme.typography.pxToRem(16),
        },
        '&:last-child': {
          fontSize: theme.typography.pxToRem(12),
          color: grey[700],
        },
      },
    },
  },
  moreResultButton: {
    display: 'flex',
    padding: theme.spacing(1),
    '& button': {
      flexGrow: 1,
      boxShadow: 'none',
      border: `1px solid ${grey[300]}`,
      color: grey[700],
      backgroundColor: 'transparent',
      '& > span': {
        textTransform: 'none',
        '& p': {
          flexGrow: 1,
          color: 'inherit',
        },
        '& .hidden': {
          visibility: 'hidden',
        },
      },
    },
  },
}));

interface Props {
  settings: Settings;
  input: QueryInput;
  result: QueryResult;
  querying: boolean;
  query: typeof query;
}

const mapStateToProps = (state: State) => ({
  settings: state.app.settings,
  input: state.explorer.input,
  result: state.explorer.result,
  querying: state.explorer.querying,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({ query }, dispatch);

const MAX_BODY_LENGH = 500;

// tslint:disable-next-line: variable-name
const SearchResult = (props: Props): JSX.Element => {
  const { settings, input, result, querying } = props;
  const { text, page, count } = input;
  const { numFound, docs } = result;

  const classes = useStyles();

  const resultDocCards = docs.map(doc => {
    const body = doc.fields[settings.bodyField];
    const title = doc.fields[settings.titleField];
    const link = doc.fields[settings.linkField];
    return (
      <Card key={doc.id} className={classes.resultCard}>
        <CardContent>
          <Typography gutterBottom={true}>{link ? <a href={link}>{title}</a> : title}</Typography>
          <Typography>
            {body && body.length > MAX_BODY_LENGH ? `${body.slice(0, MAX_BODY_LENGH)} ...` : body}
          </Typography>
        </CardContent>
      </Card>
    );
  });

  const onMoreResultsClick = () => {
    props.query(text, page + 1, count);
  };

  const moreResultsButton =
    !querying && docs.length && (page + 1) * count < numFound ? (
      <div className={classes.moreResultButton}>
        <Fab variant="extended" aria-label="More results" onClick={onMoreResultsClick}>
          <ExpandMoreIcon />
          <Typography>More results</Typography>
          <ExpandMoreIcon className="hidden" />
        </Fab>
      </div>
    ) : null;

  return (
    <div className={classes.container}>
      {resultDocCards}
      {moreResultsButton}
    </div>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchResult);
