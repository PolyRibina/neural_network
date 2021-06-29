import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import React, {Dispatch, SetStateAction, useState} from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {Container} from "@material-ui/core";
import logoMainPage from './logoMainPage.png';
import TableOfContents from "./TableOfContents";
import Button from '@material-ui/core/Button';
import AuthPage from "./AuthPage";
import Api from "./Api";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            padding: theme.spacing(2),
            textAlign: 'center',
            color: theme.palette.text.secondary,
        },
    }),
);

interface StandardComponentProps{
    sections: string[]
    setSections: Dispatch<SetStateAction<never[]>>
    themes: string[]
    setThemes: Dispatch<SetStateAction<never[]>>
}

export default function MainPage({sections, setSections,  themes, setThemes}: StandardComponentProps) {
    const classes = useStyles();
    const [auth, setAuth] = useState(false);

    const handleClick = () => {
        setAuth(!auth);
    };

    document.addEventListener("DOMContentLoaded", ()=> {
        Api.getSections().then((data)=>{
            setSections(data);
        })
    })
    if (!auth)
    return (
        <Container component="main" maxWidth="lg">
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Grid container>
                        <Grid item xs={12} sm={3}>
                            <Paper className={classes.paper}>
                                <div>
                                    <img src={logoMainPage} alt={"cannot display"} style={{height: "10vh", marginLeft: "3vh"}}/>
                                </div>
                                <Button variant="outlined" color="primary" onClick={handleClick}>
                                    Авторизоваться как преподаватель
                                </Button>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={9}>
                            <Paper className={classes.paper} style={{height: "16.6vh"}}>xs=12</Paper>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Paper className={classes.paper}>
                        <TableOfContents isTeacher={false} sections={sections} themes={themes} setThemes={setThemes} setSections={setSections}/>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={9}>
                    <Paper className={classes.paper}>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
    else{
        return (
            <AuthPage  sections={sections} setSections={setSections} themes={themes} setThemes={setThemes} handleClick={handleClick}/>
        );
    }
}