import { useRouter } from "next/router";
import React, { Fragment, memo } from "react";
import navigation from "@/config/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { GenericRecord } from "@/types";
import { can, canAny } from "@/utils/auth";
import useResponsive from "@/hooks/useResponsive";
import { settings } from "@/config";
import { useTranslation } from "@/context/contextUtils";
import { IoSearch } from "react-icons/io5";
import Link from "next/link";
import { setCreateFactoryDeviceModal } from "@/slices/appSlice";
import { Container, Nav, Navbar, NavDropdown, Button, Offcanvas } from "react-bootstrap";

const NavBar = () => {
  const t = useTranslation();

  const router = useRouter();

  const userDataData = useAppSelector((state) => state.userData.data);

  const dispatch = useAppDispatch();

  const size = useResponsive();

  const navigationWithPermissions = navigation.map((item) => {
    if (item.group) {
      return {
        ...item,
        permissions: item.group.map((subitem: GenericRecord) => subitem.permission).filter(Boolean),
      };
    }
    return {
      ...item,
      permissions: item.permission ? [item.permission] : [],
    };
  });

  const cleanPath = (path: string): string => {
    return path.endsWith("/") ? path.slice(0, -1) : path;
  };

  const isActive = React.useCallback(
    (item: GenericRecord): boolean => {
      if (cleanPath(router.pathname) === cleanPath(item.path)) {
        return true;
      }

      if (router.pathname.indexOf(item.path) == 0) {
        return true;
      }
      if (item.group) {
        return item.group.some(
          (subitem: GenericRecord) => cleanPath(subitem.path) === cleanPath(router.pathname),
        );
      }

      if (item.childrenPaths) {
        return item.childrenPaths.some(
          (subitem: string) => cleanPath(subitem) === cleanPath(router.pathname),
        );
      }

      return false;
    },
    [router.pathname],
  );

  const renderNavigationItems = () => {
    return navigationWithPermissions.map((item: GenericRecord, index) => {
      if (item.group) {
        return (
          canAny(userDataData, item.permissions) && (
            <NavDropdown
              key={index}
              title={item.icon && size !== "small" ? <item.icon /> : t(item.title)}
              id={`nav-dropdown-${index}`}
              className={isActive(item) ? "active" : ""}
              align="end"
          
          >
              {item.group.map((subitem: GenericRecord, subindex: number) => {
                return !("permission" in subitem) ||
                  ("permission" in subitem && can(userDataData, subitem.permission)) ? (
                  <li key={subindex}>
                    <Link
                      className={`dropdown-item ${isActive(subitem) ? "active" : ""}`}
                      href={subitem.path}
                      prefetch={false}
                    >
                      {t(subitem.title)}
                    </Link>
                  </li>
                ) : null;
              })}
            </NavDropdown>
          )
        );
      } else {
        return (
          can(userDataData, item.permission as string) &&
          (!item.size || item.size === size) && (


            <Fragment key={index}>
              {item.title !== "new" && (
                <Link
                  className={`nav-link ${isActive(item) ? "active" : ""}`}
                  href={item.path}
                  prefetch={false}
                >
                  {t(item.title)}
                </Link>
              )}
              {item.title === "new" && (
                <a
                  className={`nav-link`}
                  onClick={() => dispatch(setCreateFactoryDeviceModal(true))}
                >
                  {t(item.title)}
                </a>
              )}
            </Fragment>


          )
        );
      }
    });
  };

  return (
    <Navbar bg="dark" variant="dark" expand="md" className={`size-${size}`}>
      <Container fluid>
        <Link href={userDataData?.roles[0].home_path} className="text-decoration-none">
          <Navbar.Brand className="text-uppercase">{settings.app_title}</Navbar.Brand>
        </Link>
        <div className="d-md-none d-flex flex-row">
          {can(userDataData, "search") && (
            <Link href="/search" prefetch={false} >
              <Button
                variant="outline-info"
                className={`h4 my-0 me-3 ${cleanPath(router.pathname) == "/search" ? "active" : ""}`}
              >
                <IoSearch />
              </Button>
            </Link>
          )}
          <Navbar.Toggle aria-controls="offcanvasNavbar" />
        </div>
        <Navbar.Offcanvas
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
          placement="end"
          className="text-bg-dark"
        >
          <Offcanvas.Header closeButton closeVariant="white">
            <Offcanvas.Title id="offcanvasNavbarLabel">{settings.app_title}</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="justify-content-end flex-grow-1 pe-3">{renderNavigationItems()}</Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
};

export default memo(NavBar);
