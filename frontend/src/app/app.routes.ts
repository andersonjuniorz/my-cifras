import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { HomeComponent } from './components/home/home.component';
import { CifraListComponent } from './components/cifra-list/cifra-list.component';
import { CifraFormComponent } from './components/cifra-form/cifra-form.component';
import { CifraViewComponent } from './components/cifra-view/cifra-view.component';
import { CifraEditComponent } from './components/cifra-edit/cifra-edit.component';
import { AcordeManageComponent } from './components/acorde-manage/acorde-manage.component';
import { ListaListComponent } from './components/lista-list/lista-list.component';
import { ListaFormComponent } from './components/lista-form/lista-form.component';
import { ListaViewComponent } from './components/lista-view/lista-view.component';
import { AdminComponent } from './components/admin/admin.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'cifras', component: CifraListComponent },
      { path: 'cifras/novo', component: CifraFormComponent },
      { path: 'cifras/:id', component: CifraViewComponent },
      { path: 'cifras/:id/editar', component: CifraEditComponent },
      { path: 'acordes', component: AcordeManageComponent },
      { path: 'listas', component: ListaListComponent },
      { path: 'listas/nova', component: ListaFormComponent },
      { path: 'listas/:id', component: ListaViewComponent },
      { path: 'listas/:id/editar', component: ListaFormComponent },
      { path: 'admin', component: AdminComponent },
    ],
  },
];
