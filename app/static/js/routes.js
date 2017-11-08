page('/', authManager.requiresAuthentication, photoManager.listAll);
page('/photo/create', authManager.requiresAuthentication, photoManager.create);
page('/photo/:id',authManager.requiresAuthentication, photoManager.listOne);
page('/photo/viewer/:id', photoManager.listOnePublic);
page('/photo/guest/:id',/*authManager.allowOnlyGuest,*/ photoManager.listOneGuest);
page('/user/:id'/*, authManager.requiresAuthentication*/,photoManager.listAllPublic);

page('/login', authManager.showLogin);
page('/logout', authManager.logout);
page('/register', authManager.showRegister);

page({});
