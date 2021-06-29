import React, {Dispatch, SetStateAction, useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import MainPageForTeacher from "./MainPageForTeacher";

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://github.com/PolyRibina/neural_network" target="_blank">
                neural_network.com
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

interface StandardComponentProps{
    sections: string[]
    setSections: Dispatch<SetStateAction<never[]>>
    themes: string[]
    setThemes: Dispatch<SetStateAction<never[]>>
    handleClick: () => void
}
export default function AuthPage({sections, setSections, themes, setThemes, handleClick}: StandardComponentProps) {
    const classes = useStyles();

    const [code, setCode] = useState('');
    const [invalid, setInvalid] = useState(false);
    const [isTeacher, setIsTeacher] = useState(false);

    const checkValue = () => {
        if(code === 'fast50let'){
            setIsTeacher(true);
        }
        else{
            setInvalid(true);
        }
    };

    const handleClicks = () => {
        setIsTeacher(!isTeacher);
        handleClick();
    };

    const onKeyPressed = (e: { keyCode: number; }) =>{
        if (e.keyCode === 13){
            checkValue();
        }
    }

    if(!isTeacher)
    return (
        <Container style={{backgroundColor: 'white', borderRadius: '25px', paddingBottom: '20px', paddingTop: '20px', marginTop: '200px'}} component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Введите код преподавателя
                </Typography>
                <form className={classes.form} noValidate>
                    <TextField
                        onKeyDown={onKeyPressed}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Код преподавателя"
                        autoFocus
                        value={code}
                        onChange={e =>{setCode(e.target.value); setInvalid(false);}}
                    />
                    <p style={{display: invalid? 'inline':'none'}}>* Неверный код</p>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={checkValue}
                    >
                        Войти
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link href="#" variant="body2" onClick={handleClick}>
                                ← Назад
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
            <Box mt={8}>
                <Copyright />
            </Box>
        </Container>
    );
    else{
        return (
            <MainPageForTeacher sections={sections} setSections={setSections} themes={themes} setThemes={setThemes} handleClicks={handleClicks}/>
        );
    }
}