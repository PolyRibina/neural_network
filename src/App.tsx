import React, {useState} from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import MainPage from "./MainPage";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        paper: {
            padding: theme.spacing(2),
            textAlign: 'center',
            color: theme.palette.text.secondary,
        },
    }),
);

export default function FullWidthGrid() {
    const classes = useStyles();
    const [sections, setSections] = useState([]);
    const [themes, setThemes] = useState([]);

    return (
        <div className={classes.root}>
            <MainPage sections={sections} setSections={setSections} themes={themes} setThemes={setThemes}/>
        </div>
    );
}