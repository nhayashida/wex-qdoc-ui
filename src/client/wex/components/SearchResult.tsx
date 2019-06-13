import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Fab from '@material-ui/core/Fab';
import Typography from '@material-ui/core/Typography';
import { grey } from '@material-ui/core/colors';
import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { query } from '../reducers/actions';
import { State } from '../reducers/store';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    marginTop: theme.spacing(2),
  },
  resultCard: {
    backgroundColor: 'transparent',
    borderRadius: theme.typography.pxToRem(8),
    marginBottom: theme.spacing(1.5),
    boxShadow: '0 1px 6px rgba(32, 33, 36, 0.28)',
    [theme.breakpoints.up('md')]: {
      marginBottom: 0,
      boxShadow: 'unset',
    },
  },
  cardContent: {
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
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(1),
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

const MAX_BODY_LENGH = 500;

// tslint:disable-next-line: variable-name
const SearchResult = (): JSX.Element => {
  const dispatch = useDispatch();
  const settings = useSelector((state: State) => state.app.settings);
  const input = useSelector((state: State) => state.wex.input);
  const result = useSelector((state: State) => state.wex.result);
  const querying = useSelector((state: State) => state.wex.querying);
  const { numFound, docs } = result;

  const classes = useStyles();

  const [page, setPage] = useState(0);
  const [count] = useState(10);

  const resultCards = docs.map(doc => {
    const body = doc.fields[settings.bodyField];
    const title = doc.fields[settings.titleField];
    const link = doc.fields[settings.linkField];
    return (
      <Card key={doc.id} className={classes.resultCard}>
        <CardContent className={classes.cardContent}>
          <Typography gutterBottom={true}>{link ? <a href={link}>{title}</a> : title}</Typography>
          <Typography>
            {body && body.length > MAX_BODY_LENGH ? `${body.slice(0, MAX_BODY_LENGH)} ...` : body}
          </Typography>
        </CardContent>
      </Card>
    );
  });

  const onMoreResults = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    dispatch(query(input, nextPage, count));
  };

  const moreResultsButton =
    !querying && docs.length && (page + 1) * count < numFound ? (
      <div className={classes.moreResultButton}>
        <Fab variant="extended" aria-label="More results" onClick={onMoreResults}>
          <ExpandMoreIcon />
          <Typography>More results</Typography>
          <ExpandMoreIcon className="hidden" />
        </Fab>
      </div>
    ) : null;

  return (
    <div className={classes.container}>
      {resultCards}
      {moreResultsButton}
    </div>
  );
};

export default SearchResult;
