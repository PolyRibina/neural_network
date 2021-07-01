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
    map2: Map<string, string[]>
    chooseTheme: string
    sections: any[]
    sectionsHelp: any[]
    prompts: string[]
    setPrompts: Dispatch<SetStateAction<never[]>>
    setChooseTheme: Dispatch<SetStateAction<string>>
    setSections: Dispatch<SetStateAction<never[]>>
    chooseSection: string
    setChooseSection: Dispatch<SetStateAction<string>>
    chooseSectionTheme: (theme: string) => void
}

let menu: string[] = []

export default function TableOfContents({isTeacher, map2, sections, setSections, sectionsHelp, chooseTheme, setChooseTheme, chooseSection, setChooseSection, chooseSectionTheme}: StandardComponentProps) {
    const classes = useStyles();

    const [open, setOpen] = React.useState(false);

    const [openAddSection, setOpenAddSection] = React.useState(false);
    const [nameSection, setNameSection] = React.useState('');

    const [openAddTheme, setOpenAddTheme] = React.useState(false);
    const [nameTheme, setNameTheme] = React.useState('');

    const [deleteTheme, setDeleteTheme] = React.useState(false);

    const handleClick = (section: string) => {
        setChooseSection(section);
        setChooseTheme('');
        //if(section!==chooseSection){
       //     setOpen(true);
        //}
        //else{
            setOpen(!open);
        //}
    };

    const addSection = () => {
        setOpenAddSection(true);
    };

    const addSectionClose = () => {
        setNameSection('');
        setOpenAddSection(false);
    };

    const mapToObj = (inputMap: Map<string, string[]>) => {
        let obj = {};
        inputMap.forEach((value: string[], key: string) => {
            // @ts-ignore
            obj[key] = value
        });

        return obj;
    }

    const addSectionSave = () => {
        //sections = [...sections, nameSection];
        map2.set(nameSection, [])

        menu = [...menu, nameSection]; // для отображения

        Api.setContent("menu", JSON.stringify(mapToObj(map2))).then(() => {
            console.log("success set content");
            sectionsHelp = [...sectionsHelp, [nameSection, []]];
            // @ts-ignore
            setSections(sectionsHelp);
        })

        addSectionClose();
    };

    const addTheme = () => {
        setOpenAddTheme(true);
    };

    const addThemeClose = () => {
        setNameTheme('');
        setOpenAddTheme(false);
    };

    const addThemeSave = () => {
        let menuTh = map2.get(chooseSection);
        // @ts-ignore
        if (menuTh === undefined) {
            alert("Сначала выберите раздел!");
            addThemeClose();
            return;
        }
        menuTh = [...menuTh, nameTheme];
        map2.set(chooseSection, menuTh)
        Api.setContent("menu", JSON.stringify(mapToObj(map2))).then(() => {
            console.log("success set theme");
            sectionsHelp.forEach((value) => {
                if (value[0] === chooseSection) {
                    value[1] = menuTh
                }
            })
        })
        // @ts-ignore
        setSections(sectionsHelp);
        addThemeClose();
    };

    const deleteThemeOpen = () => {
        setDeleteTheme(true);
    };

    const deleteThemeClose = () => {
        setDeleteTheme(false);
    };

    const deleteThemeAgree = () => {
        //themes = themes.filter(letsdelete => letsdelete !== chooseTheme);
        //setDeleteTheme(false);
    };

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
                                <ListItem selected={section[0] === chooseSection} key={section[0]} button
                                          onClick={() => {
                                              handleClick(section[0])
                                          }}>
                                    <ListItemText primary={section[0]}/>
                                </ListItem>

                                <Collapse style={{display: section[0] === chooseSection ? 'inline' : 'none'}} in={open}
                                          timeout="auto" unmountOnExit>
                                    <List dense style={{marginLeft: "10px"}}>
                                        {section[1]?.map((theme: string) => {
                                            if (section[0] === chooseSection) {
                                                console.log(theme)
                                                return (
                                                    <ListItem selected={theme === chooseTheme} key={theme} button
                                                              onClick={() => {setChooseTheme(theme); chooseSectionTheme(theme)}}>
                                                        <ListItemText primary={theme}/>
                                                    </ListItem>
                                                );
                                            } else {
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
            <div style={{display: isTeacher ? 'inline' : 'none'}}>
                <ButtonGroup size="large" color="primary" aria-label="outlined secondary button group">
                    <PopupState variant="popover" popupId="demo-popup-menu">
                        {(popupState) => (
                            <React.Fragment>
                                <ButtonGroup><Button size="large" color="primary"
                                                     aria-label="outlined secondary button group" {...bindTrigger(popupState)}><AddIcon/></Button></ButtonGroup>
                                <Menu {...bindMenu(popupState)}>
                                    <MenuItem onClick={() => {
                                        addSection();
                                        popupState.close()
                                    }}>Добавить раздел</MenuItem>
                                    <MenuItem onClick={() => {
                                        addTheme();
                                        popupState.close()
                                    }}>Добавить тему</MenuItem>
                                </Menu>
                                <Dialog open={openAddSection} onClose={addSectionClose}
                                        aria-labelledby="form-dialog-title">
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
                                            onChange={e => {
                                                setNameSection(e.target.value)
                                            }}
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
                                            onChange={e => {
                                                setNameTheme(e.target.value)
                                            }}
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