import { Divider } from "@mui/material";
import { Link } from "@remix-run/react";
import cn from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Chip } from "@mui/material";

import styles from "./Articles.module.css";

export default function Articles() {
  return (
    <div className={styles.Articles}>
      <div className={styles.featured}>
        <div className={styles.info}>
          <div className={styles.title}>
            Pulley Injuries: Literature Review and Personal Rehab Story
          </div>
          <div className={styles.description}>
            Start to finish writeup on the entire process of fully rupturing an
            A4 pulley, reviewing a few decades of sparse research on the
            subject, and rehabbing it to full strength
          </div>
          <div className={styles.details}>
            <div className={styles.date}>Dec 29th, 2021</div>
            <div className={styles.dot}>{"•"}</div>
            <Chip
              className={cn(styles.chip, styles.climbing)}
              label="Climbing"
            />
          </div>
          <LazyLoadImage
            wrapperClassName={styles.wrapper}
            className={styles.image}
            alt={"Picture of David in a background filled with neon lights"}
            effect="blur"
            src={"https://s3.r2dliu.com/assets/articles/pulley/background.jpg"}
            placeholderSrc={
              "https://s3.r2dliu.com/assets/articles/pulley/background_small.jpg"
            }
          />
        </div>
      </div>
      <Divider className={styles.divider} />
      <div className={styles.bottom}>
        <div className={styles.column}>
          <div className={styles.article}>
            <div className={styles.info}>
              <div className={styles.title}>Notes on PODE & Ledgedashing</div>
              <div className={styles.description}>
                In-depth summary of the mechanics of PODE and how it affects
                ledgedashing. Highlights both theoretical and practical
                considerations for optimal execution
              </div>
              <div className={styles.details}>
                <div className={styles.date}>Apr 16th, 2018</div>
                <div className={styles.dot}>{"•"}</div>
                <Chip className={cn(styles.chip, styles.melee)} label="Melee" />
              </div>
            </div>
            <LazyLoadImage
              wrapperClassName={styles.wrapper}
              className={styles.image}
              alt={
                "Blurry camera photo of Fox in Super Smash Bros. Melee performing an intangible nair after a ledgedash"
              }
              effect="blur"
              src={
                "https://s3.r2dliu.com/assets/articles/ledgedash/background.jpg"
              }
              placeholderSrc={
                "https://s3.r2dliu.com/assets/articles/ledgedash/background_small.jpg"
              }
            />
          </div>
          <Link className={styles.link} to={"autocancel"}>
            <div className={styles.article}>
              <div className={styles.info}>
                <div className={styles.title}>Fox Autocancel Aerials</div>
                <div className={styles.description}>
                  Small piece on niche but practical situations for Fox's
                  underutilized autocancel options
                </div>
                <div className={styles.details}>
                  <div className={styles.date}>Sep 13th, 2019</div>
                  <div className={styles.dot}>{"•"}</div>
                  <Chip
                    className={cn(styles.chip, styles.melee)}
                    label="Melee"
                  />
                </div>
              </div>
              <LazyLoadImage
                wrapperClassName={styles.wrapper}
                className={styles.image}
                alt={
                  "Image displaying all of Fox's aerials in Super Smash Bros. Melee"
                }
                effect="blur"
                src={
                  "https://s3.r2dliu.com/assets/articles/autocancel/background.jpg"
                }
                placeholderSrc={
                  "https://s3.r2dliu.com/assets/articles/autocancel/background_small.jpg"
                }
              />
            </div>
          </Link>
          <a
            className={styles.link}
            href={"https://s3.r2dliu.com/assets/articles/kirigami/kirigami.pdf"}
            target="_blank"
          >
            <div className={styles.article}>
              <div className={styles.info}>
                <div className={styles.title}>Kirigami</div>
                <div className={styles.description}>
                  Short paper written in undergrad for a Topics in Geometry
                  class exploring some mathematical concepts in kirigami
                </div>
                <div className={styles.details}>
                  <div className={styles.date}>Dec, 2017</div>
                  <div className={styles.dot}>{"•"}</div>
                  <Chip className={cn(styles.chip, styles.math)} label="Math" />
                </div>
              </div>
              <LazyLoadImage
                wrapperClassName={styles.wrapper}
                className={styles.image}
                alt={"Diagram of the Gauss map and its relation to curvature"}
                effect="blur"
                src={
                  "https://s3.r2dliu.com/assets/articles/kirigami/background.jpg"
                }
                placeholderSrc={
                  "https://s3.r2dliu.com/assets/articles/nim/background_small.jpg"
                }
              />
            </div>
          </a>
          <a
            className={styles.link}
            href={"https://s3.r2dliu.com/assets/articles/nim/nim.pdf"}
            target="_blank"
          >
            <div className={styles.article}>
              <div className={styles.info}>
                <div className={styles.title}>On the Game of Nim</div>
                <div className={styles.description}>
                  Short discrete math paper written in undergrad exploring the
                  game of Nim
                </div>
                <div className={styles.details}>
                  <div className={styles.date}>Dec, 2015</div>
                  <div className={styles.dot}>{"•"}</div>
                  <Chip className={cn(styles.chip, styles.math)} label="Math" />
                </div>
              </div>
              <LazyLoadImage
                wrapperClassName={styles.wrapper}
                className={styles.image}
                alt={
                  "Line graph displaying paths between points with specific Nim values"
                }
                effect="blur"
                src={"https://s3.r2dliu.com/assets/articles/nim/background.jpg"}
                placeholderSrc={
                  "https://s3.r2dliu.com/assets/articles/nim/background_small.jpg"
                }
              />
            </div>
          </a>
        </div>
        <div className={styles.column}>
          {/* <LazyLoadImage
            wrapperClassName={styles.caution}
            className={styles.image}
            alt={"Yellow construction sign"}
            effect="blur"
            src={
              "https://s3.us-east-2.amazonaws.com/s3.r2dliu.com/assets/construction.png"
            }
            placeholderSrc={
              "https://s3.r2dliu.com/assets/construction_small.jpg"
            }
          /> */}
        </div>
      </div>
    </div>
  );
}
