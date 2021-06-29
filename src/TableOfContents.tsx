import React, {Dispatch, SetStateAction} from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import {ButtonGroup, DialogActions} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { Dialog } from '@material-ui/core';
import { DialogContent } from '@material-ui/core';
import { DialogContentText } from '@material-ui/core';
import { TextField } from '@material-ui/core';
import Api from "./Api";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            height: '71vh',
            maxWidth: 360,
            backgroundColor: theme.palette.background.paper,
        },
        nested: {
            paddingLeft: theme.spacing(4),
        },
    }),
);

interface StandardComponentProps{
    isTeacher: boolean
    sections: string[]
    themes: string[]
    setThemes: Dispatch<SetStateAction<never[]>>
    setSections: Dispatch<SetStateAction<never[]>>
}

export default function TableOfContents({isTeacher, sections, themes, setThemes, setSections}: StandardComponentProps) {
    const classes = useStyles();

    const [open, setOpen] = React.useState(false);

    const [openAddSection, setOpenAddSection] = React.useState(false);
    const [nameSection, setNameSection] = React.useState('');

    const [openAddTheme, setOpenAddTheme] = React.useState(false);
    const [nameTheme, setNameTheme] = React.useState('');

    const [chooseTheme, setChooseTheme] = React.useState('');
    const [chooseSection, setChooseSection] = React.useState('');

    const [deleteTheme, setDeleteTheme] = React.useState(false);

    const handleClick = (section: string) => {
        setChooseSection(section);
        setOpen(!open);
        console.log(chooseSection);
        if(open){
            Api.getThemes(section).then((data)=>{
                setThemes(data);
            }).catch(()=>{
                setThemes([]);
            })
        }
    };

    const addSection = () => {
        setOpenAddSection(true);
    };

    const addSectionClose = () => {
        setNameSection('');
        setOpenAddSection(false);
    };

    const addSectionSave = () => {
        sections = [...sections, nameSection];
        Api.setSection(nameSection).then((data)=> {
            setNameSection('');
            setSections(data);
            addSectionClose();
        });

    };

    const addTheme = () => {
        setOpenAddTheme(true);
    };

    const addThemeClose = () => {
        setNameTheme('');
        setOpenAddTheme(false);
    };

    const addThemeSave = () => {
        themes = [...themes, nameTheme];
        Api.setTheme(chooseSection, nameTheme).then((data)=> {
            setNameTheme('');
            setThemes(data)
            addThemeClose();
        });
    };

    const deleteThemeOpen = () => {
        setDeleteTheme(true);
    };

    const deleteThemeClose = () => {
        setDeleteTheme(false);
    };

    const deleteThemeAgree = () => {
        themes = themes.filter(letsdelete => letsdelete !== chooseTheme);
        setDeleteTheme(false);
    };

    document.addEventListener("DOMContentLoaded", ()=> {
        Api.getThemes(chooseSection).then((data)=>{
            setThemes(data);
            console.log(themes);
        })
    })

    return (
        <div>
            <List
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={
                    <ListSubheader component="div" id="nested-list-subheader">
                    </ListSubheader>
                }
                className={classes.root}
            >
                <List dense>
                    {sections?.map((section) => {
                        return (
                            <div>
                                <ListItem selected = {section === chooseSection} key={section} button onClick={() => {handleClick(section)}}>
                                    <ListItemText primary={section} />
                                </ListItem>

                                <Collapse style={{display: section === chooseSection? 'inline':'none'}} in={open} timeout="auto" unmountOnExit>
                                    <List dense>
                                        {themes?.map((theme) => {
                                            if(section === chooseSection){
                                                console.log(theme)
                                                return (
                                                    <ListItem selected = {theme === chooseTheme} key={theme} button onClick={() => (setChooseTheme(theme))}>
                                                        <ListItemText primary={theme} />
                                                    </ListItem>
                                                );
                                            }
                                            else {
                                                return (
                                                    <div>

                                                    </div>
                                                );
                                            }

                                        })}
                                    </List>
                                </Collapse>
                            </div>
                        );
                    })}
                </List>
            </List>
            <div style={{display: isTeacher?'inline':'none'}}>
                <ButtonGroup size="large" color="primary" aria-label="outlined secondary button group">
                    <PopupState variant="popover" popupId="demo-popup-menu">
                        {(popupState) => (
                            <React.Fragment>
                                <ButtonGroup><Button size="large" color="primary" aria-label="outlined secondary button group" {...bindTrigger(popupState)}><AddIcon/></Button></ButtonGroup>
                                <Menu {...bindMenu(popupState)}>
                                    <MenuItem onClick={()=> {addSection(); popupState.close()}}>Добавить раздел</MenuItem>
                                    <MenuItem onClick={()=> {addTheme(); popupState.close()}}>Добавить тему</MenuItem>
                                </Menu>
                                <Dialog open={openAddSection} onClose={addSectionClose} aria-labelledby="form-dialog-title">
                                    <DialogContent>
                                        <DialogContentText>
                                            Введите название раздела
                                        </DialogContentText>
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            label="Раздел"
                                            fullWidth
                                            value={nameSection}
                                            onChange={e =>{setNameSection(e.target.value)}}
                                        />
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={addSectionClose} color="primary">
                                            Отменить
                                        </Button>
                                        <Button onClick={addSectionSave} color="primary">
                                            Сохранить
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                                <Dialog open={openAddTheme} onClose={addThemeClose} aria-labelledby="form-dialog-title">
                                    <DialogContent>
                                        <DialogContentText>
                                            Введите название темы
                                        </DialogContentText>
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            label="Тема"
                                            fullWidth
                                            value={nameTheme}
                                            onChange={e =>{setNameTheme(e.target.value)}}
                                        />
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={addThemeClose} color="primary">
                                            Отменить
                                        </Button>
                                        <Button onClick={addThemeSave} color="primary">
                                            Сохранить
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                            </React.Fragment>
                        )}
                    </PopupState>
                    <Button onClick={deleteThemeOpen}><RemoveIcon/></Button>
                    <Dialog
                        open={deleteTheme}
                        onClose={deleteThemeClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Вы точно хотите удалить выбранную тему?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={deleteThemeClose} color="primary">
                                Нет, я случайно нажал на эту кнопку!
                            </Button>
                            <Button onClick={deleteThemeAgree} color="primary" autoFocus>
                                Да, уничтожим её!
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Button><ArrowUpwardIcon/></Button>
                    <Button><ArrowDownwardIcon/></Button>
                </ButtonGroup>
            </div>
        </div>
    );
}